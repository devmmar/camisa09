import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Logo } from '../Logo'
import { Link } from 'react-router-dom'

export function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const { count } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/catalogo?type=selecoes', label: 'Seleções' },
    { to: '/catalogo?type=clubes', label: 'Clubes' },
    { to: '/jogos', label: 'Jogos' },
    { to: '/sobre', label: 'Sobre' },
  ]

  async function handleSignOut() {
    await signOut()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base"
      style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24">

          <Logo size="sm" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[#26c4c9] ${isActive ? 'text-[#26c4c9]' : 'text-muted'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button onClick={() => navigate('/busca')} className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
              <Search size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2"
              title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <Link to="/favoritos" className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
                <Heart size={20} />
              </Link>
            )}

            <Link to="/carrinho" className="relative p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#26c4c9] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="p-2 text-muted hover:text-[#26c4c9] transition-colors rounded-lg hover:bg-surface-2"
                >
                  <User size={20} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl border border-base bg-surface z-50">
                    <Link to="/perfil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-surface-2 transition-colors">
                      <User size={16} /> Meu Perfil
                    </Link>
                    <Link to="/pedidos" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-surface-2 transition-colors">
                      <ShoppingCart size={16} /> Meus Pedidos
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-[#26c4c9] hover:bg-surface-2 transition-colors">
                        <Settings size={16} /> Painel Admin
                      </Link>
                    )}
                    <hr className="border-base" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-surface-2 transition-colors">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex btn-outline !py-2 !px-4 text-sm ml-1">
                Entrar
              </Link>
            )}

            <button
              className="md:hidden p-2 text-muted hover:text-[#26c4c9] rounded-lg"
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-base bg-surface">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-2 text-sm font-medium border-b border-base transition-colors ${isActive ? 'text-[#26c4c9]' : 'text-muted'}`
                }
              >
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
