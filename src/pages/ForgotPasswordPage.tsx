import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail } from 'lucide-react'
import { Logo } from '../components/Logo'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar e-mail')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-page">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-2xl font-bold mb-2">E-mail enviado!</h2>
          <p className="text-muted mb-6">Verifique sua caixa de entrada e siga as instruções.</p>
          <Link to="/login" className="btn-primary">Voltar ao login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-page">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold mt-6">Recuperar senha</h1>
          <p className="text-muted mt-1">Enviaremos um link para seu e-mail</p>
        </div>
        <div className="card p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">E-mail da conta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="seu@email.com" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
              <Mail size={18} /> {loading ? 'Enviando...' : 'Enviar link'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-muted text-sm">
          Lembrou a senha? <Link to="/login" className="text-[#26c4c9] hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </div>
  )
}
