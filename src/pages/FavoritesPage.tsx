import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ProductGrid } from '../components/product/ProductGrid'
import type { ProductWithImages } from '../types'

export function FavoritesPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('favorites')
      .select('product:products(*, images:product_images(*), category:categories(*), team:teams(*))')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setProducts((data?.map((f: { product: unknown }) => f.product) as ProductWithImages[]) ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="section-title mb-8">Favoritos</h1>
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}
