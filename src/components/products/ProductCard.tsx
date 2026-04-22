import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents)
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? PLACEHOLDER
  const isConfigurable = product.options.length > 0

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8E0] rounded-sm">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-103"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg text-kova-dark leading-tight group-hover:text-kova-brown transition-colors">
            {product.name}
          </h3>
          {isConfigurable && (
            <p className="mt-0.5 text-xs text-kova-mid">Configure to order</p>
          )}
        </div>
        <p className="text-sm font-medium text-kova-dark whitespace-nowrap">
          From {formatPrice(product.base_price)}
        </p>
      </div>
    </Link>
  )
}
