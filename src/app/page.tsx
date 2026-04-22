import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(4)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end bg-[#181511]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=85"
            alt="Modern living room"
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-60"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kova-tan mb-5">
            Made to order
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] max-w-3xl">
            Crafted to last.<br />Designed for life.
          </h1>
          <p className="mt-6 text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            Configure your piece, choose your finish, and receive it built for your space.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-block bg-kova-tan text-kova-dark text-sm font-medium px-8 py-4 rounded-sm hover:bg-white transition-colors"
            >
              Shop all furniture
            </Link>
            <Link
              href="/products?category=living-room"
              className="inline-block border border-white/40 text-white text-sm font-medium px-8 py-4 rounded-sm hover:border-white transition-colors"
            >
              Living room
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured products ─────────────────────────────────── */}
      {featured && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-heading text-3xl md:text-4xl text-kova-dark font-light">
              Featured pieces
            </h2>
            <Link
              href="/products"
              className="text-sm text-kova-brown hover:underline underline-offset-4 hidden sm:block"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {(featured as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 sm:hidden">
            <Link href="/products" className="text-sm text-kova-brown hover:underline">
              View all furniture →
            </Link>
          </div>
        </section>
      )}

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="bg-[#181511] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-light text-center mb-16">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Configure your piece',
                body: 'Choose your fabric, finish, size, and details. The price updates in real time as you build.',
              },
              {
                step: '02',
                title: 'We build it to order',
                body: 'Every piece is made when you buy it — no warehouse stock, no compromises. Ships in 8–12 weeks.',
              },
              {
                step: '03',
                title: 'White-glove delivery',
                body: 'We deliver and place it in your space, removing all packaging. Nothing left to assemble.',
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="font-heading text-5xl text-kova-tan/40 font-light mb-4">{step}</p>
                <h3 className="font-heading text-xl text-white mb-3">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value strip ──────────────────────────────────────── */}
      <section className="border-y border-kova-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Free delivery', sub: 'White-glove, to your room' },
              { label: '5-year warranty', sub: 'Structural defects covered' },
              { label: 'Made to order', sub: 'Built when you buy' },
              { label: '30-day returns', sub: 'No questions asked' },
            ].map(({ label, sub }) => (
              <div key={label}>
                <p className="font-heading text-lg text-kova-dark">{label}</p>
                <p className="text-xs text-kova-mid mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-kova-dark font-light max-w-xl mx-auto leading-tight">
          Every piece is yours before it exists.
        </h2>
        <p className="mt-4 text-kova-mid text-sm max-w-sm mx-auto">
          Configure to your exact taste. No compromises, no stock limitations.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-kova-dark text-white text-sm font-medium px-10 py-4 rounded-sm hover:bg-kova-brown transition-colors"
        >
          Start configuring
        </Link>
      </section>
    </>
  )
}
