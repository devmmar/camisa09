import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { Logo } from '../components/Logo'

export function RegisterPage() {
  const { signUp } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(v => ({ ...v, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Senha deve ter ao menos 6 caracteres'); return }
    if (form.password !== form.confirm) { setError('Senhas não coincidem'); return }
    setLoading(true)
    try {
      await signUp(form.email.trim(), form.password, form.fullName.trim())
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-page">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold mb-2">Confirme seu e-mail</h2>
          <p className="text-muted mb-6">Enviamos um link de confirmação para <strong>{form.email}</strong>.</p>
          <Link to="/login" className="btn-primary">Ir para o login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-page">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold mt-6">Criar conta</h1>
          <p className="text-muted mt-1">É grátis e rápido!</p>
        </div>
        <div className="card p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Nome completo</label>
              <input type="text" value={form.fullName} onChange={update('fullName')} className="input-field" placeholder="Seu nome" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">E-mail</label>
              <input type="email" value={form.email} onChange={update('email')} className="input-field" placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')} className="input-field pr-12" placeholder="Mínimo 6 caracteres" required />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#26c4c9]">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirmar senha</label>
              <input type="password" value={form.confirm} onChange={update('confirm')} className="input-field" placeholder="Repita a senha" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
              <UserPlus size={18} /> {loading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-muted text-sm">
          Já tem conta? <Link to="/login" className="text-[#26c4c9] hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
