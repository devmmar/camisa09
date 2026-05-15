import { Link } from 'react-router-dom'
import { Instagram, Youtube, MessageCircle } from 'lucide-react'
import { Logo } from '../Logo'

const INSTITUCIONAL = [
  ['/sobre', 'Sobre nós'],
  ['/contato', 'Política de privacidade'],
  ['/contato', 'Trocas e devoluções'],
  ['/contato', 'Termos de uso'],
  ['/contato', 'Fale conosco'],
]

const AJUDA = [
  ['/contato', 'Como comprar'],
  ['/contato', 'Formas de pagamento'],
  ['/contato', 'Prazos de entrega'],
  ['/contato', 'Rastreamento'],
  ['/contato', 'Perguntas frequentes'],
]

const CATEGORIAS = [
  ['/catalogo?category=clubes-europeus', 'Clubes Europeus'],
  ['/catalogo?category=clubes-brasileiros', 'Clubes Brasileiros'],
  ['/catalogo?category=selecoes', 'Seleções'],
  ['/catalogo?category=retro', 'Retro & Clássicas'],
  ['/catalogo?category=versao-jogador', 'Versão Jogador'],
]

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white mt-0">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Institucional */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-white mb-4">Institucional</h4>
            <ul className="space-y-2">
              {INSTITUCIONAL.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/50 hover:text-[#26c4c9] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-white mb-4">Ajuda</h4>
            <ul className="space-y-2">
              {AJUDA.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/50 hover:text-[#26c4c9] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-white mb-4">Categorias</h4>
            <ul className="space-y-2">
              {CATEGORIAS.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/50 hover:text-[#26c4c9] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fale conosco */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-white mb-4">Fale Conosco</h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>WhatsApp: (11) 93969-9999</li>
              <li>Email: contato@camisa9.com.br</li>
              <li className="pt-1">Seg à Sex: 09h às 18h</li>
              <li>Sáb: 09h às 13h</li>
            </ul>
          </div>

          {/* Formas de pagamento */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-white mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              {['VISA', 'MC', 'ELO', 'PIX'].map(p => (
                <div key={p} className="bg-white/10 border border-white/10 rounded px-2.5 py-1.5 text-xs font-bold text-white/70">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="xs" />

          <p className="text-xs text-white/30">© {new Date().getFullYear()} Camisa 9. Todos os direitos reservados.</p>

          <div className="flex items-center gap-3">
            <a href="#" className="p-2 text-white/40 hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-white/5">
              <Instagram size={17} />
            </a>
            <a href="#" className="p-2 text-white/40 hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-white/5">
              <Youtube size={17} />
            </a>
            <a href="#" className="p-2 text-white/40 hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-white/5">
              <MessageCircle size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
