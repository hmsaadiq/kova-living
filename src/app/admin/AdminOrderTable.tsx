'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/priceCalculator'
import type { Order, OrderStatus } from '@/lib/types'

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Production' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrderTable({ orders: initial }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initial)
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(orderId: string, newStatus: OrderStatus) {
    setUpdating(orderId)
    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
    setUpdating(null)
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 border border-kova-border rounded-sm">
        <p className="text-kova-mid text-sm">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-kova-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-kova-border bg-[#F0EBE1]">
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-kova-mid">Order</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-kova-mid">Date</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-kova-mid">Items</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-kova-mid">Total</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-kova-mid">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-kova-mid">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-kova-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-[#FAF8F4] transition-colors">
              <td className="px-4 py-4 font-mono text-xs text-kova-mid">
                #{order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-4 py-4 text-kova-mid text-xs">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </td>
              <td className="px-4 py-4">
                <div className="space-y-0.5">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-kova-dark">
                      {item.product_name}
                      <span className="text-kova-mid ml-1 text-xs">×{item.quantity}</span>
                    </p>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-kova-dark font-medium">
                {formatPrice(order.total_price * 100)}
              </td>
              <td className="px-4 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {STATUSES.find((s) => s.value === order.status)?.label ?? order.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <select
                  value={order.status}
                  disabled={updating === order.id}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  className="text-xs border border-kova-border rounded-sm px-2 py-1.5 text-kova-dark bg-white focus:outline-none focus:border-kova-brown disabled:opacity-50"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
