import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Settings, Sun, Moon, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Logo } from '../Logo'

const PRODUTOS_MENU = [
  { to: '/catalogo?category=clubes-europeus', label: 'Clubes Europeus' },
  { to: '/catalogo?category=clubes-brasileiros', label: 'Clubes Brasileiros' },
  { to: '/catalogo?category=selecoes', label: 'Seleções' },
  { to: '/catalogo?category=retro', label: 'Retro & Clássicas' },
  { to: '/catalogo?category=versao-jogador', label: 'Versão Jogador' },
  { to: '/catalogo?category=feminina', label: 'Feminina & Infantil' },
]

export function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const { count } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [produtosOpen, setProdutosOpen] = useState(false)
  const produtosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (produtosRef.current && !produtosRef.current.contains(e.target as Node)) {
        setProdutosOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#26c4c9] ${isActive ? 'text-[#26c4c9]' : 'text-muted'}`

  return (
    <header className="sticky top-0 z-50 border-b border-base" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">

          <Logo size="sm" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>Início</NavLink>

            {/* Produtos dropdown */}
            <div ref={produtosRef} className="relative">
              <button
                onClick={() => setProdutosOpen(v => !v)}
                className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#26c4c9] ${produtosOpen ? 'text-[#26c4c9]' : 'text-muted'}`}
              >
                Produtos <ChevronDown size={13} className={`transition-transform ${produtosOpen ? 'rotate-180' : ''}`} />
              </button>
              {produtosOpen && (
                <div className="absolute left-0 top-full mt-3 w-52 rounded-xl shadow-2xl border border-base bg-surface z-50 overflow-hidden">
                  {PRODUTOS_MENU.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setProdutosOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-surface-2 hover:text-[#26c4c9] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/catalogo?type=lancamentos" className={navLinkClass}>Lançamentos</NavLink>
            <NavLink to="/catalogo?category=selecoes" className={navLinkClass}>Seleções</NavLink>
            <NavLink to="/catalogo?category=retro" className={navLinkClass}>Retro</NavLink>
            <NavLink to="/sobre" className={navLinkClass}>Sobre nós</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => navigate('/busca')} className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
              <Search size={19} />
            </button>

            <button onClick={toggleTheme} className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {user && (
              <Link to="/favoritos" className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
                <Heart size={19} />
              </Link>
            )}

            <Link to="/carrinho" className="relative p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
              <ShoppingCart size={19} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#26c4c9] text-black text-xs font-bold rounded-full flex items-center justify-center leading-none">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(v => !v)} className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
                  <User size={19} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl border border-base bg-surface z-50">
                    <Link to="/perfil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-surface-2 transition-colors">
                      <User size={15} /> Meu Perfil
                    </Link>
                    <Link to="/pedidos" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-surface-2 transition-colors">
                      <ShoppingCart size={15} /> Meus Pedidos
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-[#26c4c9] hover:bg-surface-2 transition-colors">
                        <Settings size={15} /> Painel Admin
                      </Link>
                    )}
                    <hr className="border-base" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-surface-2 transition-colors">
                      <LogOut size={15} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex btn-primary !py-2 !px-4 ml-2 text-xs">
                Entrar
              </Link>
            )}

            <button className="lg:hidden p-2 text-muted hover:text-[#26c4c9] rounded-lg ml-1" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-base bg-surface">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {[
              { to: '/', label: 'Início', end: true },
              { to: '/catalogo', label: 'Produtos' },
              { to: '/catalogo?type=lancamentos', label: 'Lançamentos' },
              { to: '/catalogo?category=selecoes', label: 'Seleções' },
              { to: '/catalogo?category=retro', label: 'Retro' },
              { to: '/sobre', label: 'Sobre nós' },
            ].map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-2 text-sm font-bold uppercase tracking-wider border-b border-base transition-colors ${isActive ? 'text-[#26c4c9]' : 'text-muted'}`
                }>
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-3 btn-primary justify-center">
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
