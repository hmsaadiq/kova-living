'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Product, SelectedOptions } from '@/lib/types'

interface Props {
  product: Product
  selected: SelectedOptions
}

export default function LayeredViewer({ product, selected }: Props) {
  const preloadedRef = useRef(false)

  // Sort layer groups by layerOrder, fallback to their index
  const layerGroups = product.options
    .map((g, i) => ({ ...g, _index: i }))
    .filter((g) => g.isLayer)
    .sort((a, b) => (a.layerOrder ?? a._index) - (b.layerOrder ?? b._index))

  // Get active image URL for a layer group
  function getLayerImage(groupName: string): string | null {
    const group = product.options.find((g) => g.name === groupName)
    if (!group) return null
    const choice = group.choices.find((c) => c.value === selected[groupName])
    return choice?.image ?? null
  }

  // Preload all layer images on mount so swaps are instant
  useEffect(() => {
    if (preloadedRef.current) return
    preloadedRef.current = true

    const urls = product.options
      .filter((g) => g.isLayer)
      .flatMap((g) => g.choices)
      .map((c) => c.image)
      .filter(Boolean) as string[]

    if (product.base_layer) urls.push(product.base_layer)

    urls.forEach((url) => {
      const img = new window.Image()
      img.src = url
    })
  }, [product])

  const hasLayers = !!product.base_layer || layerGroups.length > 0
  const fallbackImage = product.images[0] ?? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'

  if (!hasLayers) return null

  return (
    <div className="relative w-full aspect-[16/9] bg-[#EDE8E0] rounded-sm overflow-hidden">
      {/* Base frame — always at the bottom */}
      {product.base_layer && (
        <Image
          src={product.base_layer}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      )}

      {/* Fallback if no baseLayer but has layer options */}
      {!product.base_layer && (
        <Image
          src={fallbackImage}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      )}

      {/* Layer stack — each transparent PNG stacked in order */}
      {layerGroups.map((group) => {
        const imgUrl = getLayerImage(group.name)
        if (!imgUrl) return null

        return (
          <div
            key={group.name}
            className="absolute inset-0 transition-opacity duration-300"
          >
            <Image
              src={imgUrl}
              alt={group.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        )
      })}
    </div>
  )
}
