'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { Product, SelectedOptions } from '@/lib/types'
import ProductConfigurator from './ProductConfigurator'
import LayeredViewer from './LayeredViewer'

const SofaConfigurator = dynamic(() => import('./SofaConfigurator'), { ssr: false })

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt={alt} fill className="object-contain" sizes="90vw" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-black/80"
        >×</button>
      </div>
    </div>
  )
}

export default function ProductPageClient({ product }: { product: Product }) {

  const defaultOptions: SelectedOptions = Object.fromEntries(
    product.options.map((g) => [g.name, g.choices[0]?.value ?? ''])
  )
  const [selected, setSelected] = useState<SelectedOptions>(defaultOptions)
  const [displayImage, setDisplayImage] = useState<string>('')
  const [fading, setFading] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

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
          <>
            <SofaConfigurator product={product} selected={selected} />
            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxSrc(img)}
                    className="relative aspect-square bg-[#EDE8E0] rounded-sm overflow-hidden hover:ring-2 hover:ring-kova-brown transition-all"
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="15vw" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            {lightboxSrc && <ImageLightbox src={lightboxSrc} alt={product.name} onClose={() => setLightboxSrc(null)} />}
          </>
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
