'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/priceCalculator'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
        <ShoppingBag size={48} className="text-kova-border mb-6" />
        <h1 className="font-heading text-3xl text-kova-dark font-light">Your cart is empty</h1>
        <p className="mt-3 text-kova-mid text-sm">Find a piece you love and configure it to your taste.</p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-kova-dark text-white text-sm font-medium px-8 py-3.5 rounded-sm hover:bg-kova-brown transition-colors"
        >
          Shop now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl text-kova-dark font-light mb-12">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Line items */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => {
            const image = item.product.images[0] ?? PLACEHOLDER
            return (
              <div key={item.id} className="flex gap-6 pb-8 border-b border-kova-border">
                {/* Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-[#EDE8E0] rounded-sm overflow-hidden">
                  <Image src={image} alt={item.product.name} fill sizes="128px" className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/products/${item.product.slug}`} className="font-heading text-lg text-kova-dark hover:text-kova-brown transition-colors leading-tight">
                      {item.product.name}
                    </Link>
                    <p className="text-sm font-medium text-kova-dark whitespace-nowrap">
                      {formatPrice(item.unitPrice * item.quantity * 100)}
                    </p>
                  </div>

                  {/* Selected options */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(item.selectedOptions).map(([key, val]) => (
                      <span key={key} className="text-xs bg-[#EDE8E0] text-kova-mid px-2 py-0.5 rounded-full capitalize">
                        {val.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Quantity + remove */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 border border-kova-border rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-kova-mid hover:text-kova-dark transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm text-kova-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-kova-mid hover:text-kova-dark transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-kova-mid hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#F0EBE1] rounded-sm p-6 lg:sticky lg:top-24 space-y-4">
            <h2 className="font-heading text-xl text-kova-dark">Order Summary</h2>
            <div className="flex justify-between text-sm text-kova-mid">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice * 100)}</span>
            </div>
            <div className="flex justify-between text-sm text-kova-mid">
              <span>Delivery</span>
              <span className="text-green-700">Free</span>
            </div>
            <div className="border-t border-kova-border pt-4 flex justify-between font-medium text-kova-dark">
              <span>Total</span>
              <span>{formatPrice(totalPrice * 100)}</span>
            </div>

            {/* Demo notice */}
            <div className="mt-2 p-3 bg-kova-tan/20 rounded-sm text-xs text-kova-mid leading-relaxed">
              This is a portfolio demo. Checkout is disabled — no real orders are processed.
            </div>

            <button
              disabled
              className="w-full bg-kova-mid text-white py-4 rounded-sm text-sm font-medium cursor-not-allowed opacity-60 mt-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
