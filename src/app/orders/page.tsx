import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Order } from '@/lib/types'
import { formatPrice } from '@/lib/priceCalculator'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Orders' }

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Production',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/?signin=true')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl text-kova-dark font-light mb-10">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-kova-mid text-sm">You haven't placed any orders yet.</p>
          <a href="/products" className="mt-4 inline-block text-sm text-kova-brown hover:underline">
            Start shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {(orders as Order[]).map((order) => (
            <div key={order.id} className="border border-kova-border rounded-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-kova-mid">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-kova-mid mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div className="text-kova-dark">
                      {item.product_name}
                      <span className="text-kova-mid ml-2 text-xs">
                        × {item.quantity}
                      </span>
                    </div>
                    <span className="text-kova-mid">{formatPrice(item.unit_price * 100)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-kova-border flex justify-between text-sm font-medium text-kova-dark">
                <span>Total</span>
                <span>{formatPrice(order.total_price * 100)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
