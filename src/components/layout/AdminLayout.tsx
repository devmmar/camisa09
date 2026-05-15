import { Outlet, Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Tag, ArrowLeft, FileText, MessageSquareQuote, LayoutGrid, Receipt } from 'lucide-react'
import { Logo } from '../Logo'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#26c4c9] text-black' : 'text-muted hover:bg-surface-2'}`

export function AdminLayout() {
  const lojaLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/produtos', label: 'Produtos', icon: Package },
    { to: '/admin/pedidos', label: 'Pedidos do Site', icon: ShoppingBag },
    { to: '/admin/vendas', label: 'Vendas Manuais', icon: Receipt },
    { to: '/admin/cupons', label: 'Cupons', icon: Tag },
  ]

  const contentLinks = [
    { to: '/admin/conteudo', label: 'Textos & Banners', icon: FileText },
    { to: '/admin/categorias', label: 'Categorias', icon: LayoutGrid },
    { to: '/admin/depoimentos', label: 'Depoimentos', icon: MessageSquareQuote },
  ]

  return (
    <div className="min-h-screen flex bg-page">
      <aside className="w-60 bg-surface border-r border-base flex flex-col shrink-0">
        <div className="p-5 border-b border-base flex items-center gap-3">
          <Logo size="xs" href="/admin" />
          <p className="text-xs text-muted font-medium">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs text-muted uppercase tracking-widest px-3 mb-2">Loja</p>
          <div className="space-y-1 mb-6">
            {lojaLinks.map(({ to, label, icon: Icon, exact }) => (
              <NavLink key={to} to={to} end={exact} className={linkClass}>
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </div>

          <p className="text-xs text-muted uppercase tracking-widest px-3 mb-2">Conteúdo</p>
          <div className="space-y-1">
            {contentLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </div>
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
