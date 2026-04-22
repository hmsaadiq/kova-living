import Link from 'next/link'

const LINKS = {
  Shop: [
    { label: 'Living Room', href: '/products?category=living-room' },
    { label: 'Bedroom', href: '/products?category=bedroom' },
    { label: 'Dining', href: '/products?category=dining' },
    { label: 'All Products', href: '/products' },
  ],
  Company: [
    { label: 'How It Works', href: '/#how-it-works' },
  ],
  Support: [
    { label: 'My Orders', href: '/orders' },
    { label: 'FAQ', href: '/#faq' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-kova-border bg-kova-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-heading text-lg font-semibold text-kova-dark">Kova Living</span>
            <p className="mt-3 text-sm text-kova-mid leading-relaxed max-w-[200px]">
              Modern furniture, made to order. Built for your space, your way.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-kova-mid mb-3">
                {heading}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-kova-mid hover:text-kova-dark transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-kova-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-kova-mid">
          <p>© {new Date().getFullYear()} Kova Living. Portfolio demo project.</p>
          <p>Built with Next.js · Supabase · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
