import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kova Living — Modern Furniture, Made to Order',
    template: '%s | Kova Living',
  },
  description:
    'Kova Living crafts modern furniture to order. Configure your piece, choose your finish, and receive it built for your space.',
  keywords: ['furniture', 'modern furniture', 'made to order', 'custom furniture', 'DTC furniture'],
  openGraph: {
    title: 'Kova Living — Modern Furniture, Made to Order',
    description: 'Configure your perfect piece. Built to order, built to last.',
    siteName: 'Kova Living',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-kova-cream text-kova-dark antialiased">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
