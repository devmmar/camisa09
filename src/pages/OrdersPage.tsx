import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { OrderWithItems } from '../types'

const STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendente',   color: 'text-[#26c4c9]/60' },
  confirmed: { label: 'Confirmado', color: 'text-[#26c4c9]' },
  shipped:   { label: 'Enviado',    color: 'text-muted' },
  delivered: { label: 'Entregue',   color: 'text-[#26c4c9]' },
  cancelled: { label: 'Cancelado',  color: 'text-red-500' },
}

export function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setOrders((data as OrderWithItems[]) ?? []); setLoading(false) })
  }, [user])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="section-title mb-8">Meus Pedidos</h1>
      {!orders.length ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-muted">Você ainda não fez nenhum pedido</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = STATUS[order.status] ?? { label: order.status, color: 'text-muted' }
            return (
              <div key={order.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted mt-0.5">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-muted">
                      <span>{item.product?.name} ({item.size}) x{item.quantity}</span>
                      <span>R$ {(item.unit_price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-base">
                  <span>Total</span>
                  <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
