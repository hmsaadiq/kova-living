'use client'

import { useState } from 'react'
import { ShoppingBag, Check, QrCode } from 'lucide-react'
import type { Product, SelectedOptions } from '@/lib/types'
import { calculatePrice, formatPrice } from '@/lib/priceCalculator'
import { getSwatchColor } from '@/lib/swatches'
import { useCart } from '@/context/CartContext'

interface Props {
  product: Product
  selected: SelectedOptions
  onSelect: (group: string, value: string) => void
}

export default function ProductConfigurator({ product, selected, onSelect }: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [qrHint, setQrHint] = useState(false)

  const price = calculatePrice(product, selected)

  function handleAddToCart() {
    addToCart(product, selected)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.options.length === 0) {
    return (
      <div className="space-y-6">
        <p className="text-2xl font-heading text-kova-dark">{formatPrice(product.base_price * 100)}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-kova-dark text-white py-4 rounded-sm text-sm font-medium hover:bg-kova-brown transition-colors flex items-center justify-center gap-2"
        >
          {added ? <><Check size={16} /> Added</> : <><ShoppingBag size={16} /> Add to Cart</>}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Price */}
      <div>
        <p className="font-heading text-3xl text-kova-dark">{formatPrice(price * 100)}</p>
        {price !== product.base_price && (
          <p className="text-xs text-kova-mid mt-1">
            Base {formatPrice(product.base_price * 100)} + options
          </p>
        )}
      </div>

      {/* Option groups */}
      {product.options.map((group) => {
        const selectedVal = selected[group.name]
        const isToggle = group.type === 'toggle'

        return (
          <div key={group.name}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-kova-mid">
                {group.name}
              </p>
              <p className="text-sm text-kova-dark">
                {group.choices.find((c) => c.value === selectedVal)?.label}
              </p>
            </div>

            {isToggle ? (
              <div className="flex flex-wrap gap-2">
                {group.choices.map((choice) => {
                  const active = selectedVal === choice.value
                  return (
                    <button
                      key={choice.value}
                      onClick={() => onSelect(group.name, choice.value)}
                      className={`px-4 py-2 rounded-sm text-sm border transition-colors ${
                        active
                          ? 'bg-kova-dark text-white border-kova-dark'
                          : 'border-kova-border text-kova-mid hover:border-kova-brown'
                      }`}
                    >
                      {choice.label}
                      {choice.priceModifier > 0 && (
                        <span className="ml-1 text-xs opacity-70">
                          +{formatPrice(choice.priceModifier * 100)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {group.choices.map((choice) => {
                  const active = selectedVal === choice.value
                  const swatchColor =
                    choice.swatchColor ??
                    getSwatchColor(group.name, choice.value)

                  return (
                    <button
                      key={choice.value}
                      onClick={() => onSelect(group.name, choice.value)}
                      title={choice.label}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                        active
                          ? 'border-kova-dark scale-110'
                          : 'border-transparent hover:border-kova-mid'
                      }`}
                      style={{ backgroundColor: swatchColor ?? '#C8B89A' }}
                    >
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check
                            size={14}
                            className={swatchColor && isLight(swatchColor) ? 'text-kova-dark' : 'text-white'}
                          />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Add to cart */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-kova-dark text-white py-4 rounded-sm text-sm font-medium hover:bg-kova-brown transition-colors flex items-center justify-center gap-2"
        >
          {added ? (
            <><Check size={16} /> Added to Cart</>
          ) : (
            <><ShoppingBag size={16} /> Add to Cart — {formatPrice(price * 100)}</>
          )}
        </button>

        <div className="relative">
          <button
            className="h-full px-4 border border-kova-border rounded-sm text-kova-mid hover:border-kova-brown hover:text-kova-brown transition-colors"
            onClick={() => { setQrHint(true); setTimeout(() => setQrHint(false), 2000) }}
          >
            <QrCode size={18} />
          </button>
          {qrHint && (
            <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-kova-dark text-white text-xs px-3 py-1.5 rounded-sm">
              Coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
