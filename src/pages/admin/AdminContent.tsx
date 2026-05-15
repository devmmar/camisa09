import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Upload, Loader2 } from 'lucide-react'

type Row = { key: string; value: string; label: string; type: string; section: string }
type Tab = 'hero' | 'topbar' | 'promo' | 'geral'

const TAB_LABELS: Record<Tab, string> = {
  hero: 'Hero',
  topbar: 'Barra de Anúncios',
  promo: 'Banner Promocional',
  geral: 'Geral',
}

export function AdminContent() {
  const [rows, setRows] = useState<Row[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [tab, setTab] = useState<Tab>('hero')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').order('section').then(({ data }) => {
      if (data) {
        setRows(data as Row[])
        const map: Record<string, string> = {}
        data.forEach(r => { map[r.key] = r.value })
        setValues(map)
      }
    })
  }, [])

  async function saveKey(key: string) {
    setSaving(v => ({ ...v, [key]: true }))
    await supabase.from('site_settings')
      .update({ value: values[key], updated_at: new Date().toISOString() } as never)
      .eq('key', key)
    setSaving(v => ({ ...v, [key]: false }))
    setSaved(v => ({ ...v, [key]: true }))
    setTimeout(() => setSaved(v => ({ ...v, [key]: false })), 2000)
  }

  async function saveAll() {
    const sectionRows = rows.filter(r => r.section === tab)
    setSaving(v => { const s = { ...v }; sectionRows.forEach(r => { s[r.key] = true }); return s })
    for (const r of sectionRows) {
      await supabase.from('site_settings')
        .update({ value: values[r.key], updated_at: new Date().toISOString() } as never)
        .eq('key', r.key)
    }
    setSaving({})
    const s: Record<string, boolean> = {}
    sectionRows.forEach(r => { s[r.key] = true })
    setSaved(s)
    setTimeout(() => setSaved({}), 2500)
  }

  async function uploadHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `site/hero-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      setValues(v => ({ ...v, hero_image_url: publicUrl }))
      await supabase.from('site_settings')
        .update({ value: publicUrl, updated_at: new Date().toISOString() } as never)
        .eq('key', 'hero_image_url')
      setSaved(v => ({ ...v, hero_image_url: true }))
      setTimeout(() => setSaved(v => ({ ...v, hero_image_url: false })), 2500)
    }
    setUploading(false)
  }

  const tabRows = rows.filter(r => r.section === tab && r.type !== 'image')
  const allSaving = Object.values(saving).some(Boolean)

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conteúdo do Site</h1>
        <button onClick={saveAll} disabled={allSaving} className="btn-primary disabled:opacity-50">
          {allSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar Tudo
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-base">
        {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-[#26c4c9] text-[#26c4c9]' : 'border-transparent text-muted hover:text-[inherit]'
            }`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Hero image upload */}
      {tab === 'hero' && (
        <div className="card p-5 mb-6">
          <p className="text-sm font-semibold mb-3">Imagem do Hero</p>
          {values['hero_image_url'] && (
            <img src={values['hero_image_url']} alt="Hero" className="w-full h-48 object-cover rounded-lg mb-3" />
          )}
          <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-base hover:border-[#26c4c9] rounded-xl p-4 transition-colors">
            {uploading ? <Loader2 size={20} className="animate-spin text-muted" /> : <Upload size={20} className="text-muted" />}
            <span className="text-sm text-muted">{uploading ? 'Enviando...' : 'Clique para trocar a imagem do hero'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={uploadHeroImage} disabled={uploading} />
          </label>
          {saved['hero_image_url'] && <p className="text-xs text-[#26c4c9] mt-2">✓ Imagem atualizada!</p>}
        </div>
      )}

      {/* Fields */}
      <div className="space-y-5">
        {tabRows.map(row => (
          <div key={row.key} className="card p-5">
            <label className="block text-sm font-semibold mb-2">{row.label}</label>
            <div className="flex gap-2">
              {row.key.includes('subtitle') || row.key.includes('text') ? (
                <textarea
                  value={values[row.key] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [row.key]: e.target.value }))}
                  className="input-field resize-none min-h-20 flex-1"
                  rows={3}
                />
              ) : (
                <input
                  value={values[row.key] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [row.key]: e.target.value }))}
                  className="input-field flex-1"
                />
              )}
              <button
                onClick={() => saveKey(row.key)}
                disabled={saving[row.key]}
                className="btn-primary !px-3 shrink-0 disabled:opacity-50"
                title="Salvar"
              >
                {saving[row.key]
                  ? <Loader2 size={16} className="animate-spin" />
                  : saved[row.key]
                    ? <span className="text-xs">✓</span>
                    : <Save size={16} />
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      {tabRows.length === 0 && !['hero'].includes(tab) && (
        <p className="text-muted text-sm py-8 text-center">Nenhum campo disponível nesta seção.</p>
      )}
    </div>
  )
}
