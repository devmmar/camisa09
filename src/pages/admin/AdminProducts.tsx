import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false) })
  }, [])

  async function toggleActive(product: Product) {
    await supabase.from('products').update({ is_active: !product.is_active } as never).eq('id', product.id)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn-primary"><Plus size={18} /> Novo Produto</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base">
                {['Nome', 'Preço', 'Estoque', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-base hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{p.name}</div>
                    {p.is_new && <span className="text-xs text-[#26c4c9]">NOVO</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">R$ {p.price.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-[#26c4c9]/70' : 'text-muted'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${p.is_active ? 'text-[#26c4c9]' : 'text-muted'}`}>
                      {p.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Link to={`/admin/produtos/${p.id}/editar`} className="p-1.5 hover:bg-surface-2 rounded transition-colors">
                      <Edit size={16} className="text-muted hover:text-[#26c4c9]" />
                    </Link>
                    <button onClick={() => toggleActive(p)} className="p-1.5 hover:bg-surface-2 rounded transition-colors">
                      {p.is_active ? <ToggleRight size={18} className="text-[#26c4c9]" /> : <ToggleLeft size={18} className="text-muted" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length && <div className="text-center py-12 text-muted">Nenhum produto cadastrado</div>}
        </div>
      )}
    </div>
  )
}
