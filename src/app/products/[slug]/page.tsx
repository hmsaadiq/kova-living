import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Product } from '@/lib/types'
import type { Metadata } from 'next'
import ProductPageClient from '@/components/products/ProductPageClient'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name, description').eq('slug', slug).single()
  if (!data) return {}
  return { title: data.name, description: data.description }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  const p = product as Product

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Breadcrumb + Name — server-rendered above the interactive area */}
      <div className="mb-10">
        <nav className="text-xs text-kova-mid space-x-2 mb-6">
          <a href="/products" className="hover:text-kova-dark transition-colors">Shop</a>
          <span>/</span>
          <span className="capitalize">{p.category.replace('-', ' ')}</span>
        </nav>
        <h1 className="font-heading text-4xl md:text-5xl font-light text-kova-dark leading-tight">
          {p.name}
        </h1>
        <p className="mt-4 text-kova-mid text-sm leading-relaxed max-w-md">
          {p.description}
        </p>
      </div>

      {/* Interactive image viewer + configurator */}
      <ProductPageClient product={p} />

      {/* Value props */}
      <div className="border-t border-kova-border mt-12 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-kova-mid">
        <div>
          <p className="font-semibold text-kova-dark">Made to order</p>
          <p>Built when you buy. Ships in 8–12 weeks.</p>
        </div>
        <div>
          <p className="font-semibold text-kova-dark">Free delivery</p>
          <p>White-glove delivery included.</p>
        </div>
        <div>
          <p className="font-semibold text-kova-dark">5-year warranty</p>
          <p>Structural defects covered.</p>
        </div>
        <div>
          <p className="font-semibold text-kova-dark">Portfolio demo</p>
          <p>Checkout disabled — this is a demo.</p>
        </div>
      </div>
    </div>
  )
}
