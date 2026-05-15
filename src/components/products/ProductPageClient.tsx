'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product, SelectedOptions } from '@/lib/types'
import { getOverlayColor } from '@/lib/swatches'
import ProductConfigurator from './ProductConfigurator'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'

export default function ProductPageClient({ product }: { product: Product }) {
  const defaultOptions: SelectedOptions = Object.fromEntries(
    product.options.map((g) => [g.name, g.choices[0]?.value ?? ''])
  )
  const [selected, setSelected] = useState<SelectedOptions>(defaultOptions)

  const images = product.images.length > 0 ? product.images : [PLACEHOLDER]
  const overlayColor = getOverlayColor(product.options, selected)

  function handleSelect(group: string, value: string) {
    setSelected((prev) => ({ ...prev, [group]: value }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Image viewer with color overlay */}
      <div className="space-y-3">
        <div className="relative aspect-[4/3] bg-[#EDE8E0] rounded-sm overflow-hidden isolate">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover grayscale"
          />
          <div
            className="absolute inset-0 transition-colors duration-500 pointer-events-none"
            style={{
              backgroundColor: overlayColor ?? 'transparent',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {images.slice(1).map((img, i) => (
              <div
                key={i}
                className="relative aspect-square bg-[#EDE8E0] rounded-sm overflow-hidden isolate"
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover grayscale"
                />
                <div
                  className="absolute inset-0 transition-colors duration-500 pointer-events-none"
                  style={{
                    backgroundColor: overlayColor ?? 'transparent',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configurator — controlled */}
      <ProductConfigurator
        product={product}
        selected={selected}
        onSelect={handleSelect}
      />
    </div>
  )
}
