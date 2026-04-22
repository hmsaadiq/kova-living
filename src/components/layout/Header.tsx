'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Living Room', href: '/products?category=living-room' },
  { label: 'Bedroom', href: '/products?category=bedroom' },
  { label: 'Dining', href: '/products?category=dining' },
]

export default function Header() {
  const { totalItems } = useCart()
  const { user, signInWithGoogle, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-kova-cream/95 backdrop-blur-sm border-b border-kova-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-xl font-semibold tracking-tight text-kova-dark"
          >
            Kova Living
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-kova-mid hover:text-kova-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/orders"
                  className="text-sm text-kova-mid hover:text-kova-dark transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-kova-mid hover:text-kova-dark transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="hidden md:flex items-center gap-1.5 text-sm text-kova-mid hover:text-kova-dark transition-colors"
              >
                <User size={16} />
                Sign in
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 text-kova-dark"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-kova-brown text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-kova-dark"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-kova-border bg-kova-cream px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-kova-mid"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-kova-border" />
          {user ? (
            <>
              <Link href="/orders" className="text-sm text-kova-mid" onClick={() => setMobileOpen(false)}>
                My Orders
              </Link>
              <button onClick={signOut} className="text-sm text-kova-mid text-left">
                Sign out
              </button>
            </>
          ) : (
            <button onClick={signInWithGoogle} className="text-sm text-kova-mid text-left">
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </header>
  )
}
