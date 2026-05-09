import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 })
  const [lowStock, setLowStock] = useState<Product[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('*').lte('stock', 5).eq('is_active', true).order('stock'),
    ]).then(([p, o, u, ls]) => {
      const revenue = (o.data as { total: number }[] ?? []).reduce((s, r) => s + r.total, 0)
      setStats({ products: p.count ?? 0, orders: o.count ?? 0, users: u.count ?? 0, revenue })
      setLowStock((ls.data as Product[]) ?? [])
    })
  }, [])

  const cards = [
    { label: 'Produtos', value: stats.products, icon: Package, color: 'text-[#26c4c9]' },
    { label: 'Pedidos', value: stats.orders, icon: ShoppingBag, color: 'text-[#26c4c9]' },
    { label: 'Usuários', value: stats.users, icon: Users, color: 'text-[#26c4c9]/70' },
    { label: 'Receita', value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: 'text-[#26c4c9]' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black mt-1">{value}</p>
              </div>
              <Icon size={24} className={color} />
            </div>
          </div>
        ))}
      </div>

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
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-500' : 'text-[#26c4c9]/70'}`}>
                    {p.stock === 0 ? 'Esgotado' : `${p.stock} un.`}
                  </span>
                  <Link to={`/admin/produtos/${p.id}/editar`}
                    className="text-xs text-[#26c4c9] hover:underline">
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
