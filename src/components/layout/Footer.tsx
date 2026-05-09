import { Link } from 'react-router-dom'
import { MessageCircle, Mail } from 'lucide-react'
import { Logo } from '../Logo'

export function Footer() {
  return (
    <footer className="border-t border-base mt-20 bg-surface-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-muted text-sm max-w-xs">
              Camisetas de futebol com estilo street. Para quem vive o jogo dentro e fora de campo.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-surface hover:bg-surface-2 border border-base rounded-lg transition-colors font-bold text-xs leading-none flex items-center justify-center w-9 h-9">IG</a>
              <a href="#" className="p-2 bg-surface hover:bg-surface-2 border border-base rounded-lg transition-colors"><MessageCircle size={18} /></a>
              <a href="#" className="p-2 bg-surface hover:bg-surface-2 border border-base rounded-lg transition-colors"><Mail size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted mb-4">Loja</h4>
            <ul className="space-y-2">
              {[
                ['/catalogo', 'Catálogo'],
                ['/catalogo?type=lancamentos', 'Lançamentos'],
                ['/catalogo?type=promocoes', 'Promoções'],
                ['/jogos', 'Jogos'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-muted hover:text-[#26c4c9] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted mb-4">Ajuda</h4>
            <ul className="space-y-2">
              {[
                ['/sobre', 'Sobre nós'],
                ['/contato', 'Contato'],
                ['/contato', 'Trocas e Devoluções'],
                ['/contato', 'Envios'],
              ].map(([to, label]) => (
                <li key={label}><Link to={to} className="text-sm text-muted hover:text-[#26c4c9] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-base flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">© {new Date().getFullYear()} Camisa 9. Todos os direitos reservados.</p>
          <p className="text-xs text-muted">Feito com paixão pelo futebol</p>
        </div>
      </div>
    </footer>
  )
}
