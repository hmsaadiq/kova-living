'use client'

import { useEffect, useRef, Suspense, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Product, SelectedOptions } from '@/lib/types'

// ─── Model ───────────────────────────────────────────────────────────────────

function SofaModel({ product, selected }: { product: Product; selected: SelectedOptions }) {
  const { scene } = useGLTF(product.model_url!)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const materialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map())

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
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <Environment preset="apartment" />

      <Suspense fallback={null}>
        <SofaModel product={product} selected={selected} />
      </Suspense>

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={4}
        blur={2}
        far={2}
      />
    </>
  )
}

// ─── Camera reset helper ──────────────────────────────────────────────────────

function CameraSetup() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(2.5, 1.2, 3)
    camera.lookAt(0, 0.4, 0)
  }, [camera])
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
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <CameraSetup />
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
