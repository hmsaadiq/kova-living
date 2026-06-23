'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { Product, SelectedOptions } from '@/lib/types'
import ProductConfigurator from './ProductConfigurator'
import LayeredViewer from './LayeredViewer'

// Canvas cannot run on the server — load client-only
const SofaConfigurator = dynamic(() => import('./SofaConfigurator'), { ssr: false })

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'

export default function ProductPageClient({ product }: { product: Product }) {
  console.log('[ProductPageClient] model_url:', product.model_url)

  const defaultOptions: SelectedOptions = Object.fromEntries(
    product.options.map((g) => [g.name, g.choices[0]?.value ?? ''])
  )
  const [selected, setSelected] = useState<SelectedOptions>(defaultOptions)
  const [displayImage, setDisplayImage] = useState<string>('')
  const [fading, setFading] = useState(false)

  const is3D = !!product.model_url
  const isLayered = !is3D && (!!product.base_layer || product.options.some((g) => g.isLayer))

  const baseImages = product.images.length > 0 ? product.images : [PLACEHOLDER]

  function getActiveChoiceImage(sel: SelectedOptions): string | null {
    for (const group of product.options) {
      if (group.isLayer) continue // layers handled by LayeredViewer
      const choice = group.choices.find((c) => c.value === sel[group.name])
      if (choice?.image) return choice.image
    }
    return null
  }

  const primaryImage = getActiveChoiceImage(selected) ?? baseImages[0]

  useEffect(() => {
    setDisplayImage(primaryImage)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Preload all non-layer choice images
  useEffect(() => {
    if (isLayered) return
    const urls = product.options
      .filter((g) => !g.isLayer)
      .flatMap((g) => g.choices)
      .map((c) => c.image)
      .filter(Boolean) as string[]
    urls.forEach((url) => {
      const img = new window.Image()
      img.src = url
    })
  }, [product, isLayered])

  // Crossfade on image swap (non-layered products only)
  useEffect(() => {
    if (isLayered || !displayImage || displayImage === primaryImage) return
    setFading(true)
    const t = setTimeout(() => {
      setDisplayImage(primaryImage)
      setFading(false)
    }, 180)
    return () => clearTimeout(t)
  }, [primaryImage]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(group: string, value: string) {
    setSelected((prev) => ({ ...prev, [group]: value }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Image viewer */}
      <div className="space-y-3">
        {is3D ? (
          /* 3D configurator */
          <SofaConfigurator product={product} selected={selected} />
        ) : isLayered ? (
          /* Transparent PNG layer compositor */
          <LayeredViewer product={product} selected={selected} />
        ) : (
          /* Image swap fallback */
          <>
            <div className="relative aspect-[4/3] bg-[#EDE8E0] rounded-sm overflow-hidden">
              <Image
                src={displayImage || primaryImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
            {baseImages.length > 1 && !getActiveChoiceImage(selected) && (
              <div className="grid grid-cols-3 gap-3">
                {baseImages.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-square bg-[#EDE8E0] rounded-sm overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 2}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Configurator */}
      <ProductConfigurator
        product={product}
        selected={selected}
        onSelect={handleSelect}
      />
    </div>
  )
}
