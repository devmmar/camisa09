import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Order } from '../../types'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const
const LABELS: Record<string, string> = { pending: 'Pendente', confirmed: 'Confirmado', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' }
const COLORS: Record<string, string> = { pending: 'text-[#26c4c9]/60', confirmed: 'text-[#26c4c9]', shipped: 'text-muted', delivered: 'text-[#26c4c9]', cancelled: 'text-red-500' }

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [])

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status } as never).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base">
                {['ID', 'Data', 'Total', 'Status', 'Ação'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-base hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-muted">{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm font-semibold">R$ {order.total.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${COLORS[order.status]}`}>{LABELS[order.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                      className="text-xs bg-surface-2 border border-base rounded px-2 py-1 focus:outline-none focus:border-[#26c4c9]">
                      {STATUSES.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && <div className="text-center py-12 text-muted">Nenhum pedido ainda</div>}
        </div>
      )}
    </div>
  )
}
