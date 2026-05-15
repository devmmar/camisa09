import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, Receipt, Truck, CreditCard } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'

function fmt(v: number) { return `R$ ${v.toFixed(2).replace('.', ',')}` }

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenueOrders: 0 })
  const [manualStats, setManualStats] = useState({ count: 0, revenue: 0, pending: 0, shipped: 0 })
  const [lowStock, setLowStock] = useState<Product[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('*').lte('stock', 5).eq('is_active', true).order('stock'),
      supabase.from('manual_sales').select('total, payment_status, delivery_status'),
    ]).then(([p, o, u, ls, ms]) => {
      const revenueOrders = (o.data as { total: number }[] ?? []).reduce((s, r) => s + r.total, 0)
      setStats({ products: p.count ?? 0, orders: o.count ?? 0, users: u.count ?? 0, revenueOrders })
      setLowStock((ls.data as Product[]) ?? [])

      const msData = (ms.data as { total: number; payment_status: string; delivery_status: string }[]) ?? []
      const paidSales = msData.filter(s => s.payment_status === 'paid')
      setManualStats({
        count: msData.length,
        revenue: paidSales.reduce((acc, s) => acc + s.total, 0),
        pending: msData.filter(s => s.payment_status === 'pending').length,
        shipped: msData.filter(s => s.delivery_status === 'shipped').length,
      })
    })
  }, [])

  const totalRevenue = stats.revenueOrders + manualStats.revenue

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted text-sm mb-8">Visão geral da operação</p>

      {/* Receita geral */}
      <div className="card p-5 mb-6 border-[#26c4c9]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Receita Total Geral</p>
            <p className="text-4xl font-black text-[#26c4c9]">{fmt(totalRevenue)}</p>
          </div>
          <TrendingUp size={40} className="text-[#26c4c9]/20" />
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-base text-sm">
          <div>
            <p className="text-xs text-muted mb-0.5">Pedidos do site</p>
            <p className="font-bold">{fmt(stats.revenueOrders)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Vendas manuais pagas</p>
            <p className="font-bold">{fmt(manualStats.revenue)}</p>
          </div>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Produtos', value: stats.products, icon: Package },
          { label: 'Pedidos do Site', value: stats.orders, icon: ShoppingBag },
          { label: 'Vendas Manuais', value: manualStats.count, icon: Receipt },
          { label: 'Usuários', value: stats.users, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black mt-1">{value}</p>
              </div>
              <Icon size={22} className="text-[#26c4c9]" />
            </div>
          </div>
        ))}
      </div>

      {/* Alertas vendas manuais */}
      {(manualStats.pending > 0 || manualStats.shipped > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {manualStats.pending > 0 && (
            <Link to="/admin/vendas" className="card p-5 flex items-center gap-4 hover:border-[#26c4c9]/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold">{manualStats.pending} venda{manualStats.pending !== 1 ? 's' : ''} aguardando pagamento</p>
                <p className="text-xs text-muted">Clique para gerenciar</p>
              </div>
            </Link>
          )}
          {manualStats.shipped > 0 && (
            <Link to="/admin/vendas" className="card p-5 flex items-center gap-4 hover:border-[#26c4c9]/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center shrink-0">
                <Truck size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold">{manualStats.shipped} envio{manualStats.shipped !== 1 ? 's' : ''} a caminho</p>
                <p className="text-xs text-muted">Clique para gerenciar</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Estoque baixo */}
      {lowStock.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-[#26c4c9]" />
            <h2 className="font-bold">Estoque Baixo</h2>
            <span className="ml-auto text-xs text-muted">{lowStock.length} produto{lowStock.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-base last:border-0">
                <span className="text-sm font-medium">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-500' : 'text-yellow-400'}`}>
                    {p.stock === 0 ? 'Esgotado' : `${p.stock} un.`}
                  </span>
                  <Link to={`/admin/produtos/${p.id}/editar`} className="text-xs text-[#26c4c9] hover:underline">
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
