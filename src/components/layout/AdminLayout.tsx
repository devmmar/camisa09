import { Outlet, Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Tag, ArrowLeft } from 'lucide-react'
import { Logo } from '../Logo'

export function AdminLayout() {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/produtos', label: 'Produtos', icon: Package },
    { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { to: '/admin/cupons', label: 'Cupons', icon: Tag },
  ]

  return (
    <div className="min-h-screen flex bg-page">
      <aside className="w-60 bg-surface border-r border-base flex flex-col">
        <div className="p-5 border-b border-base flex items-center gap-3">
          <Logo size="xs" href="/admin" />
          <p className="text-xs text-muted font-medium">Painel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#26c4c9] text-black' : 'text-muted hover:bg-surface-2'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-base">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted hover:text-[#26c4c9] transition-colors">
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
