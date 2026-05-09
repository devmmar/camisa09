import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ProductWithImages } from '../types'

interface UseProductsOptions {
  featured?: boolean
  isNew?: boolean
  categoryId?: string
  teamId?: string
  search?: string
  limit?: number
  type?: string
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(options)])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('products')
        .select('*, images:product_images(*), category:categories(*), team:teams(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (options.featured) query = query.eq('is_featured', true)
      if (options.isNew) query = query.eq('is_new', true)
      if (options.categoryId) query = query.eq('category_id', options.categoryId)
      if (options.teamId) query = query.eq('team_id', options.teamId)
      if (options.search) query = query.ilike('name', `%${options.search}%`)
      if (options.limit) query = query.limit(options.limit)

      const { data, error } = await query
      if (error) throw error
      setProducts((data as ProductWithImages[]) ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ProductWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetchProduct()
  }, [slug])

  async function fetchProduct() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, images:product_images(*), category:categories(*), team:teams(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      if (error) throw error
      setProduct(data as ProductWithImages)
    } catch {
      setError('Produto não encontrado')
    } finally {
      setLoading(false)
    }
  }

  return { product, loading, error }
}
