import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Product } from '@/lib/types'
import type { Metadata } from 'next'
import ProductConfigurator from '@/components/products/ProductConfigurator'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'

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
  const images = p.images.length > 0 ? p.images : [PLACEHOLDER]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[4/3] bg-[#EDE8E0] rounded-sm overflow-hidden">
            <Image
              src={images[0]}
              alt={p.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square bg-[#EDE8E0] rounded-sm overflow-hidden">
                  <Image
                    src={img}
                    alt={`${p.name} view ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Configurator */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-kova-mid space-x-2">
            <a href="/products" className="hover:text-kova-dark transition-colors">Shop</a>
            <span>/</span>
            <span className="capitalize">{p.category.replace('-', ' ')}</span>
          </nav>

          {/* Name */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-light text-kova-dark leading-tight">
              {p.name}
            </h1>
            <p className="mt-4 text-kova-mid text-sm leading-relaxed max-w-md">
              {p.description}
            </p>
          </div>

          {/* Configurator */}
          <ProductConfigurator product={p} />

          {/* Value props */}
          <div className="border-t border-kova-border pt-6 grid grid-cols-2 gap-4 text-xs text-kova-mid">
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
      </div>
    </div>
  )
}
