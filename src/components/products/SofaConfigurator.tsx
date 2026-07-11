'use client'

import { useEffect, useMemo, useState, useCallback, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { OptionChoice, Product, SelectedOptions } from '@/lib/types'

// ─── Model ───────────────────────────────────────────────────────────────────

const warnedTextureUrls = new Set<string>()

function normalizeModelName(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, ' ')
}

function materialNames(material: THREE.Material | THREE.Material[]) {
  const materials = Array.isArray(material) ? material : [material]
  return materials.map((mat) => mat.name).filter(Boolean)
}

function configureTexture(tex: THREE.Texture) {
  tex.flipY = false
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
}

function loadMaterialTexture(
  loader: THREE.TextureLoader,
  url: string,
  onLoad: (tex: THREE.Texture) => void
) {
  loader.load(
    url,
    (tex) => {
      configureTexture(tex)
      onLoad(tex)
    },
    undefined,
    () => {
      if (!warnedTextureUrls.has(url)) {
        warnedTextureUrls.add(url)
        console.warn(`[SofaConfigurator] Could not load texture: ${url}`)
      }
    }
  )
}

function createMaterial(choice: OptionChoice, loader: THREE.TextureLoader) {
  const mat = new THREE.MeshStandardMaterial({
    color: choice.textureUrl ? '#ffffff' : (choice.swatchColor ?? '#ffffff'),
    roughness: choice.roughness ?? 0.8,
    metalness: choice.metalness ?? 0,
  })

  if (choice.textureUrl) {
    loadMaterialTexture(loader, choice.textureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      mat.map = tex
      mat.needsUpdate = true
    })
  }

  if (choice.roughnessUrl) {
    loadMaterialTexture(loader, choice.roughnessUrl, (tex) => {
      mat.roughnessMap = tex
      mat.needsUpdate = true
    })
  }

  if (choice.aoUrl) {
    loadMaterialTexture(loader, choice.aoUrl, (tex) => {
      mat.aoMap = tex
      mat.aoMapIntensity = 1
      mat.needsUpdate = true
    })
  }

  return mat
}

function ensureAoUvs(geometry: THREE.BufferGeometry) {
  if (!geometry.attributes.uv || geometry.attributes.uv2) return
  geometry.setAttribute('uv2', geometry.attributes.uv)
}

function SofaModel({ product, selected }: { product: Product; selected: SelectedOptions }) {
  const { scene } = useGLTF(product.model_url!)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const textureLoader = useMemo(() => new THREE.TextureLoader(), [])

  const meshOptionMap = useMemo(() => {
    const map = new Map<string, string>() // meshName → group.name
    for (const group of product.options) {
      const names = group.meshNames ?? (group.meshName ? [group.meshName] : [])
      for (const name of names) map.set(normalizeModelName(name), group.name)
    }
    return map
  }, [product.options])

  const materialOptionMap = useMemo(() => {
    const map = new Map<string, string>() // materialName → group.name
    for (const group of product.options) {
      const names = group.materialNames ?? (group.materialName ? [group.materialName] : [])
      for (const name of names) map.set(normalizeModelName(name), group.name)
    }
    return map
  }, [product.options])

  const offset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    return [-center.x, -center.y, -center.z] as [number, number, number]
  }, [cloned])

  useEffect(() => {
    cloned.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return

      const groupName =
        meshOptionMap.get(normalizeModelName(node.name)) ??
        materialNames(node.material)
          .map(normalizeModelName)
          .map((name) => materialOptionMap.get(name))
          .find(Boolean)

      if (!groupName) return
      const group = product.options.find((g) => g.name === groupName)
      if (!group) return
      const choice = group.choices.find((c) => c.value === selected[groupName])
      if (!choice) return

      if (choice.aoUrl) ensureAoUvs(node.geometry)
      node.material = createMaterial(choice, textureLoader)
    })
  }, [selected, cloned, meshOptionMap, materialOptionMap, product.options, textureLoader])

  return (
    <group position={offset}>
      <primitive object={cloned} />
    </group>
  )
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function SceneBounds({ onReady }: { onReady: (center: THREE.Vector3, size: number) => void }) {
  const { scene } = useThree()
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    onReady(center, Math.max(size.x, size.y, size.z) * 1.2)
  }, [scene, onReady])
  return null
}

function CameraSetup({ target, distance }: { target: THREE.Vector3; distance: number }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(target.x + distance * 0.8, target.y + distance * 0.5, target.z + distance)
    camera.lookAt(target)
  }, [camera, target, distance])
  return null
}

function Scene({ product, selected }: { product: Product; selected: SelectedOptions }) {
  const [camTarget, setCamTarget] = useState(new THREE.Vector3(0, 0, 0))
  const [camDistance, setCamDistance] = useState(3)

  const handleReady = useCallback((center: THREE.Vector3, size: number) => {
    setCamTarget(center)
    setCamDistance(size)
  }, [])

  return (
    <>
      <CameraSetup target={camTarget} distance={camDistance} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} />
      <Environment preset="apartment" />
      <Suspense fallback={null}>
        <SofaModel product={product} selected={selected} />
        <SceneBounds onReady={handleReady} />
      </Suspense>
      <ContactShadows position={[0, -0.01, 0]} opacity={0.35} scale={10} blur={2.5} far={4} />
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SofaConfigurator({ product, selected }: { product: Product; selected: SelectedOptions }) {
  if (!product.model_url) return null

  return (
    <div className="w-full aspect-[4/3] bg-[#EDE8E0] rounded-sm overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFShadowMap
        }}
      >
        <Scene product={product} selected={selected} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={2}
          maxDistance={6}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
