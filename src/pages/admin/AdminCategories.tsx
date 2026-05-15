import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Upload, Save, Loader2, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react'
import type { Category } from '../../types'

type CatRow = Category & { image_url?: string; sort_order?: number; is_visible?: boolean }

export function AdminCategories() {
  const [cats, setCats] = useState<CatRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => {
        const rows = (data as CatRow[]) ?? []
        setCats(rows)
        const n: Record<string, string> = {}
        rows.forEach(c => { n[c.id] = c.name })
        setNames(n)
        setLoading(false)
      })
  }, [])

  async function uploadImage(catId: string, file: File) {
    setUploading(catId)
    const path = `categories/${catId}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      await supabase.from('categories').update({ image_url: publicUrl } as never).eq('id', catId)
      setCats(v => v.map(c => c.id === catId ? { ...c, image_url: publicUrl } : c))
    }
    setUploading(null)
  }

  async function saveName(cat: CatRow) {
    setSaving(cat.id)
    await supabase.from('categories').update({ name: names[cat.id] } as never).eq('id', cat.id)
    setCats(v => v.map(c => c.id === cat.id ? { ...c, name: names[cat.id] } : c))
    setSaving(null)
  }

  async function toggleVisible(cat: CatRow) {
    const newVal = !cat.is_visible
    await supabase.from('categories').update({ is_visible: newVal } as never).eq('id', cat.id)
    setCats(v => v.map(c => c.id === cat.id ? { ...c, is_visible: newVal } : c))
  }

  if (loading) return (
    <div className="p-8 flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Categorias</h1>
      <p className="text-muted text-sm mb-8">Edite o nome, imagem e visibilidade de cada categoria na home.</p>

      <div className="space-y-4">
        {cats.map(cat => (
          <div key={cat.id} className={`card p-4 flex gap-4 items-start ${cat.is_visible === false ? 'opacity-50' : ''}`}>
            <GripVertical size={18} className="text-muted mt-1 shrink-0" />

            {/* Imagem */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-2 shrink-0 border border-base">
              {cat.image_url
                ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-muted text-xs text-center px-1">Sem imagem</div>
              }
              <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                {uploading === cat.id
                  ? <Loader2 size={18} className="text-white animate-spin" />
                  : <Upload size={18} className="text-white" />
                }
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(cat.id, f) }}
                  disabled={uploading === cat.id} />
              </label>
            </div>

            {/* Nome */}
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Nome</label>
              <div className="flex gap-2">
                <input
                  value={names[cat.id] ?? cat.name}
                  onChange={e => setNames(v => ({ ...v, [cat.id]: e.target.value }))}
                  className="input-field flex-1"
                />
                <button onClick={() => saveName(cat)} disabled={saving === cat.id}
                  className="btn-primary !px-3 disabled:opacity-50">
                  {saving === cat.id ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                </button>
              </div>
            </div>

            {/* Toggle visível */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="text-xs text-muted">Visível</span>
              <button onClick={() => toggleVisible(cat)}>
                {cat.is_visible !== false
                  ? <ToggleRight size={22} className="text-[#26c4c9]" />
                  : <ToggleLeft size={22} className="text-muted" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
