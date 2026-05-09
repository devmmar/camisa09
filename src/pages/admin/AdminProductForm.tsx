import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Upload, Save, X, Star } from 'lucide-react'
import type { Category, Team, ProductImage } from '../../types'

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '1', '2', '3', '4']

export function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', original_price: '',
    category_id: '', team_id: '', stock: '0', is_active: true,
    is_featured: false, is_new: false, sizes: [] as string[], tags: '',
  })

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data ?? []))
    supabase.from('teams').select('*').then(({ data }) => setTeams(data ?? []))
    if (isEdit) loadProduct()
  }, [id])

  async function loadProduct() {
    const { data } = await supabase.from('products').select('*, images:product_images(*)').eq('id', id!).single()
    if (!data) return
    type Row = {
      name: string; slug: string; description: string | null; price: number
      original_price: number | null; category_id: string | null; team_id: string | null
      stock: number; is_active: boolean; is_featured: boolean; is_new: boolean
      sizes: string[] | null; tags: string[] | null
      images: ProductImage[] | null
    }
    const p = data as unknown as Row
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? '',
      price: String(p.price), original_price: String(p.original_price ?? ''),
      category_id: p.category_id ?? '', team_id: p.team_id ?? '',
      stock: String(p.stock), is_active: p.is_active,
      is_featured: p.is_featured, is_new: p.is_new,
      sizes: p.sizes ?? [], tags: p.tags?.join(', ') ?? '',
    })
    const imgs = p.images ?? []
    setExistingImages(imgs)
    const primary = imgs.find(i => i.is_primary)
    if (primary) setPrimaryImageId(primary.id)
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewImages(prev => [...prev, ...files])
    setNewImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
  }

  function removeNewImage(index: number) {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function deleteExistingImage(img: ProductImage) {
    await supabase.from('product_images').delete().eq('id', img.id)
    setExistingImages(prev => prev.filter(i => i.id !== img.id))
    if (primaryImageId === img.id) setPrimaryImageId(null)
  }

  async function setPrimaryImage(imgId: string) {
    if (!id) return
    await supabase.from('product_images').update({ is_primary: false } as never).eq('product_id', id)
    await supabase.from('product_images').update({ is_primary: true } as never).eq('id', imgId)
    setExistingImages(prev => prev.map(i => ({ ...i, is_primary: i.id === imgId })))
    setPrimaryImageId(imgId)
  }

  function generateSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function toggleSize(size: string) {
    setForm(v => ({
      ...v,
      sizes: v.sizes.includes(size) ? v.sizes.filter(s => s !== size) : [...v.sizes, size],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const productData = {
        name: form.name.trim(),
        slug: form.slug || generateSlug(form.name),
        description: form.description || null,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        category_id: form.category_id || null,
        team_id: form.team_id || null,
        stock: parseInt(form.stock),
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_new: form.is_new,
        sizes: form.sizes,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      let productId = id
      if (isEdit) {
        const { error } = await supabase.from('products').update(productData as never).eq('id', id!)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('products').insert(productData as never).select().single()
        if (error) throw error
        productId = (data as { id: string }).id
      }

      if (newImages.length && productId) {
        const currentCount = existingImages.length
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i]
          const ext = file.name.split('.').pop()
          const path = `products/${productId}/${Date.now()}-${i}.${ext}`
          const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
            const isPrimary = currentCount === 0 && i === 0 && !primaryImageId
            await supabase.from('product_images').insert({
              product_id: productId,
              url: publicUrl,
              is_primary: isPrimary,
              position: currentCount + i,
            } as never)
          }
        }
      }

      navigate('/admin/produtos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate('/admin/produtos')} className="flex items-center gap-2 text-muted hover:text-[#26c4c9] mb-6 transition-colors">
        <ArrowLeft size={18} /> Voltar
      </button>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Nome *</label>
            <input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value, slug: generateSlug(e.target.value) }))} className="input-field" placeholder="Nome da camiseta" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm(v => ({ ...v, price: e.target.value }))} className="input-field" placeholder="99.90" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preço original</label>
            <input type="number" step="0.01" value={form.original_price} onChange={e => setForm(v => ({ ...v, original_price: e.target.value }))} className="input-field" placeholder="129.90" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estoque</label>
            <input type="number" value={form.stock} onChange={e => setForm(v => ({ ...v, stock: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <select value={form.team_id} onChange={e => setForm(v => ({ ...v, team_id: e.target.value }))} className="input-field">
              <option value="">Selecionar time</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select value={form.category_id} onChange={e => setForm(v => ({ ...v, category_id: e.target.value }))} className="input-field">
              <option value="">Selecionar categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} className="input-field min-h-24 resize-y" placeholder="Descreva a camiseta..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Tamanhos disponíveis</label>
          <div className="flex gap-2 flex-wrap">
            {SIZES.map(size => (
              <button type="button" key={size} onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded border text-sm transition-colors ${form.sizes.includes(size) ? 'border-[#26c4c9] bg-[#26c4c9]/10 text-[#26c4c9]' : 'border-base text-muted hover:border-[#26c4c9]'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Imagens</label>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-3">
              {existingImages.map(img => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-base">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={() => setPrimaryImage(img.id)}
                      title="Definir como principal"
                      className={`p-1.5 rounded-full ${img.is_primary ? 'bg-[#26c4c9] text-black' : 'bg-white/20 text-white hover:bg-[#26c4c9] hover:text-black'} transition-colors`}>
                      <Star size={14} />
                    </button>
                    <button type="button" onClick={() => deleteExistingImage(img)}
                      className="p-1.5 rounded-full bg-white/20 text-white hover:bg-[#26c4c9] hover:text-black transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  {img.is_primary && (
                    <div className="absolute top-1 left-1 bg-[#26c4c9] text-black text-xs px-1.5 py-0.5 rounded font-bold">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-3">
              {newImagePreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#26c4c9]/30">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-[#26c4c9] hover:text-black transition-colors">
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs text-center py-0.5 rounded">
                    Nova
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-base hover:border-[#26c4c9] rounded-xl p-6 cursor-pointer transition-colors">
            <Upload size={28} className="text-muted mb-2" />
            <span className="text-sm text-muted">Adicionar imagens</span>
            <span className="text-xs text-muted mt-1">Selecione uma ou mais</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </label>
        </div>

        <div className="flex gap-6">
          {[
            { key: 'is_active', label: 'Produto ativo' },
            { key: 'is_featured', label: 'Destaque' },
            { key: 'is_new', label: 'Lançamento' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={e => setForm(v => ({ ...v, [key]: e.target.checked }))} className="w-4 h-4 accent-[#26c4c9]" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          <Save size={18} /> {saving ? 'Salvando...' : 'Salvar produto'}
        </button>
      </form>
    </div>
  )
}
