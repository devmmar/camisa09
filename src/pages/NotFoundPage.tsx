import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 px-4 text-center">
      <div className="text-8xl font-black text-muted opacity-10">404</div>
      <h1 className="text-3xl font-bold -mt-8">Página não encontrada</h1>
      <p className="text-muted">Parece que a bola saiu pela linha de fundo...</p>
      <Link to="/" className="btn-primary mt-2">Voltar ao início</Link>
    </div>
  )
}
