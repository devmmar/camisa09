import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Save } from 'lucide-react'

export function ProfilePage() {
  const { profile, user } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName.trim(), phone: phone.trim() } as never).eq('id', user!.id)
      if (error) throw error
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#26c4c9]/20 flex items-center justify-center">
          <User size={24} className="text-[#26c4c9]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-muted text-sm">{profile?.email ?? user?.email}</p>
        </div>
      </div>

      <div className="card p-6">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-[#26c4c9]/10 border border-[#26c4c9]/30 text-[#26c4c9] text-sm px-4 py-3 rounded-lg mb-6">Perfil atualizado!</div>}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Nome completo</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input-field" placeholder="Seu nome" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input type="email" value={user?.email ?? ''} className="input-field opacity-50 cursor-not-allowed" disabled />
            <p className="text-xs text-muted mt-1">O e-mail não pode ser alterado aqui</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telefone / WhatsApp</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="+55 (11) 99999-9999" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            <Save size={18} /> {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
