import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Shop All Furniture' }

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Living Room', value: 'living-room' },
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Dining', value: 'dining' },
]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: products } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-4xl md:text-5xl text-kova-dark font-light">
          {category
            ? CATEGORIES.find((c) => c.value === category)?.label ?? 'Shop'
            : 'All Furniture'}
        </h1>
        <p className="mt-2 text-kova-mid text-sm">
          {products?.length ?? 0} pieces
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-12 flex-wrap">
        {CATEGORIES.map((cat) => {
          const active = (category ?? '') === cat.value
          const href = cat.value ? `/products?category=${cat.value}` : '/products'
          return (
            <a
              key={cat.value}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                active
                  ? 'bg-kova-dark text-white border-kova-dark'
                  : 'border-kova-border text-kova-mid hover:border-kova-brown hover:text-kova-brown'
              }`}
            >
              {cat.label}
            </a>
          )
        })}
      </div>

      {/* Grid */}
      {!products || products.length === 0 ? (
        <p className="text-kova-mid text-sm">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
