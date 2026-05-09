import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Coupon } from '../../types'

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discount_type: 'percent', discount_value: '', min_order: '', max_uses: '', expires_at: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('coupons').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCoupons(data ?? []); setLoading(false) })
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type as 'percent' | 'fixed',
      discount_value: parseFloat(form.discount_value),
      min_order: form.min_order ? parseFloat(form.min_order) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: true,
    } as never).select().single()
    if (!error && data) {
      setCoupons(prev => [data as Coupon, ...prev])
      setForm({ code: '', discount_type: 'percent', discount_value: '', min_order: '', max_uses: '', expires_at: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function toggleCoupon(coupon: Coupon) {
    await supabase.from('coupons').update({ is_active: !coupon.is_active } as never).eq('id', coupon.id)
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cupons</h1>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary"><Plus size={18} /> Novo Cupom</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="block text-xs text-muted mb-1">Código *</label><input value={form.code} onChange={e => setForm(v => ({ ...v, code: e.target.value }))} className="input-field" placeholder="PROMO10" required /></div>
            <div><label className="block text-xs text-muted mb-1">Tipo *</label>
              <select value={form.discount_type} onChange={e => setForm(v => ({ ...v, discount_type: e.target.value }))} className="input-field">
                <option value="percent">Porcentagem (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </div>
            <div><label className="block text-xs text-muted mb-1">Valor *</label><input type="number" value={form.discount_value} onChange={e => setForm(v => ({ ...v, discount_value: e.target.value }))} className="input-field" placeholder="10" required /></div>
            <div><label className="block text-xs text-muted mb-1">Pedido mínimo</label><input type="number" value={form.min_order} onChange={e => setForm(v => ({ ...v, min_order: e.target.value }))} className="input-field" placeholder="100" /></div>
            <div><label className="block text-xs text-muted mb-1">Usos máximos</label><input type="number" value={form.max_uses} onChange={e => setForm(v => ({ ...v, max_uses: e.target.value }))} className="input-field" placeholder="100" /></div>
            <div><label className="block text-xs text-muted mb-1">Expira em</label><input type="date" value={form.expires_at} onChange={e => setForm(v => ({ ...v, expires_at: e.target.value }))} className="input-field" /></div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Salvando...' : 'Criar cupom'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base">
                {['Código', 'Tipo', 'Desconto', 'Usos', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-b border-base hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.discount_type === 'percent' ? '%' : 'R$'}</td>
                  <td className="px-4 py-3 text-sm">{c.discount_type === 'percent' ? `${c.discount_value}%` : `R$ ${c.discount_value}`}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold ${c.is_active ? 'text-[#26c4c9]' : 'text-muted'}`}>{c.is_active ? 'Ativo' : 'Inativo'}</span></td>
                  <td className="px-4 py-3"><button onClick={() => toggleCoupon(c)}>{c.is_active ? <ToggleRight size={20} className="text-[#26c4c9]" /> : <ToggleLeft size={20} className="text-muted" />}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!coupons.length && <div className="text-center py-12 text-muted">Nenhum cupom criado</div>}
        </div>
      )}
    </div>
  )
}
