import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Star, ToggleLeft, ToggleRight } from 'lucide-react'

type Testimonial = {
  id: string
  author_name: string
  author_handle: string
  rating: number
  body: string
  is_active: boolean
}

const EMPTY = { author_name: '', author_handle: '', rating: 5, body: '', is_active: true }

export function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems((data as Testimonial[]) ?? []); setLoading(false) })
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data } = await supabase.from('testimonials').insert(form as never).select().single()
    if (data) setItems(v => [data as Testimonial, ...v])
    setForm(EMPTY)
    setSaving(false)
  }

  async function toggle(item: Testimonial) {
    await supabase.from('testimonials').update({ is_active: !item.is_active } as never).eq('id', item.id)
    setItems(v => v.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i))
  }

  async function remove(id: string) {
    if (!confirm('Remover este depoimento?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    setItems(v => v.filter(i => i.id !== id))
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Depoimentos</h1>

      {/* Formulário */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted">Novo Depoimento</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome *</label>
              <input value={form.author_name} onChange={e => setForm(v => ({ ...v, author_name: e.target.value }))}
                className="input-field" placeholder="Maria Silva" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">@ Handle</label>
              <input value={form.author_handle} onChange={e => setForm(v => ({ ...v, author_handle: e.target.value }))}
                className="input-field" placeholder="@mariasilva" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Avaliação</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(v => ({ ...v, rating: n }))}>
                  <Star size={22} className={n <= form.rating ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Depoimento *</label>
            <textarea value={form.body} onChange={e => setForm(v => ({ ...v, body: e.target.value }))}
              className="input-field resize-none min-h-20" placeholder="O que o cliente disse..." required rows={3} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            <Plus size={16} /> {saving ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`card p-4 flex gap-4 ${!item.is_active ? 'opacity-50' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{item.author_name}</span>
                  {item.author_handle && <span className="text-xs text-muted">{item.author_handle}</span>}
                  <div className="flex gap-0.5 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < item.rating ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted italic">"{item.body}"</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => toggle(item)} className="p-1.5 hover:bg-surface-2 rounded transition-colors" title={item.is_active ? 'Desativar' : 'Ativar'}>
                  {item.is_active
                    ? <ToggleRight size={18} className="text-[#26c4c9]" />
                    : <ToggleLeft size={18} className="text-muted" />}
                </button>
                <button onClick={() => remove(item.id)} className="p-1.5 hover:bg-surface-2 rounded transition-colors">
                  <Trash2 size={16} className="text-muted hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-center text-muted py-8">Nenhum depoimento cadastrado.</p>}
        </div>
      )}
    </div>
  )
}
