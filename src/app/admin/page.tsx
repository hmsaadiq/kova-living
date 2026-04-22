import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Order } from '@/lib/types'
import type { Metadata } from 'next'
import AdminOrderTable from './AdminOrderTable'

export const metadata: Metadata = { title: 'Admin — Orders' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const stats = {
    total: orders?.length ?? 0,
    pending: orders?.filter((o) => o.status === 'pending').length ?? 0,
    inProgress: orders?.filter((o) => o.status === 'in_progress').length ?? 0,
    delivered: orders?.filter((o) => o.status === 'delivered').length ?? 0,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl text-kova-dark font-light mb-2">Order Management</h1>
      <p className="text-kova-mid text-sm mb-10">Kova Living admin dashboard</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total orders', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'In production', value: stats.inProgress },
          { label: 'Delivered', value: stats.delivered },
        ].map(({ label, value }) => (
          <div key={label} className="border border-kova-border rounded-sm p-5">
            <p className="text-3xl font-heading text-kova-dark">{value}</p>
            <p className="text-xs text-kova-mid mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Orders table — client component for status updates */}
      <AdminOrderTable orders={(orders ?? []) as Order[]} />
    </div>
  )
}
