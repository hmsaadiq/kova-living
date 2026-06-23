'use client'

import { useEffect, useRef, Suspense, useMemo, useState, useCallback } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Product, SelectedOptions } from '@/lib/types'

// ─── Model ───────────────────────────────────────────────────────────────────

function SofaModel({ product, selected }: { product: Product; selected: SelectedOptions }) {
  const { scene } = useGLTF(product.model_url!)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const materialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map())

  // Debug: log all mesh names in the loaded model
  useEffect(() => {
    console.log('[SofaModel] All mesh names in GLB:')
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(' -', child.name)
      }
    })
  }, [cloned])

  // Build a map of meshName → option group for quick lookup
  const meshOptionMap = useMemo(() => {
    const map = new Map<string, { groupName: string }>()
    for (const group of product.options) {
      if (group.meshName) map.set(group.meshName, { groupName: group.name })
    }
    return map
  }, [product.options])

  // Apply materials whenever selection changes
  useEffect(() => {
    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const mapping = meshOptionMap.get(child.name)
      if (!mapping) return

      const group = product.options.find((g) => g.name === mapping.groupName)
      if (!group) return

      const choice = group.choices.find((c) => c.value === selected[group.name])
      if (!choice?.swatchColor) return

      // Reuse cached material or create a new one
      const cacheKey = `${child.name}-${choice.value}`
      if (!materialsRef.current.has(cacheKey)) {
        materialsRef.current.set(
          cacheKey,
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(choice.swatchColor),
            roughness: choice.roughness ?? 0.8,
            metalness: choice.metalness ?? 0,
          })
        )
      }

      child.material = materialsRef.current.get(cacheKey)!
    })
  }, [selected, cloned, meshOptionMap, product.options])

  return <primitive object={cloned} />
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({ product, selected }: { product: Product; selected: SelectedOptions }) {
  const [camTarget, setCamTarget] = useState(new THREE.Vector3(0, 0.5, 0))
  const [camDistance, setCamDistance] = useState(3)

  const handleReady = useCallback((center: THREE.Vector3, distance: number) => {
    setCamTarget(center)
    setCamDistance(distance)
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

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.35}
        scale={10}
        blur={2.5}
        far={4}
      />
    </>
  )
}

// ─── Camera reset helper ──────────────────────────────────────────────────────

function CameraSetup({ target, distance }: { target: THREE.Vector3; distance: number }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(
      target.x + distance * 0.8,
      target.y + distance * 0.5,
      target.z + distance * 1.0
    )
    camera.lookAt(target)
  }, [camera, target, distance])
  return null
}

function SceneBounds({ onReady }: { onReady: (center: THREE.Vector3, distance: number) => void }) {
  const { scene } = useThree()
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    onReady(center, maxDim * 1.2)
  }, [scene, onReady])
  return null
}

// ─── Exported component ───────────────────────────────────────────────────────

export default function SofaConfigurator({
  product,
  selected,
}: {
  product: Product
  selected: SelectedOptions
}) {
  if (!product.model_url) return null

  return (
    <div className="w-full aspect-[4/3] bg-[#EDE8E0] rounded-sm overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFShadowMap
        }}
      >
        {/* CameraSetup is now inside Scene, driven by model bounds */}
        <Scene product={product} selected={selected} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={2}
          maxDistance={6}
          target={[0, 0.4, 0]}
        />
      </Canvas>
    </div>
  )
}
