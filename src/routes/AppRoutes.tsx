import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './ProtectedRoute'
import { MainLayout } from '../components/layout/MainLayout'
import { AdminLayout } from '../components/layout/AdminLayout'

// Pages
import { HomePage } from '../pages/HomePage'
import { CatalogPage } from '../pages/CatalogPage'
import { ProductPage } from '../pages/ProductPage'
import { CartPage } from '../pages/CartPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { ProfilePage } from '../pages/ProfilePage'
import { OrdersPage } from '../pages/OrdersPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { GamesPage } from '../pages/GamesPage'
import { SearchPage } from '../pages/SearchPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// Admin
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminProducts } from '../pages/admin/AdminProducts'
import { AdminProductForm } from '../pages/admin/AdminProductForm'
import { AdminOrders } from '../pages/admin/AdminOrders'
import { AdminCoupons } from '../pages/admin/AdminCoupons'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/produto/:slug" element={<ProductPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/jogos" element={<GamesPage />} />
        <Route path="/busca" element={<SearchPage />} />

        {/* Auth only */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/produtos" element={<AdminProducts />} />
          <Route path="/admin/produtos/novo" element={<AdminProductForm />} />
          <Route path="/admin/produtos/:id/editar" element={<AdminProductForm />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/cupons" element={<AdminCoupons />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
