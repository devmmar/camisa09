import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { CartItemWithProduct } from '../types'

interface CartContextType {
  items: CartItemWithProduct[]
  count: number
  total: number
  loading: boolean
  addItem: (productId: string, size: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (code: string) => Promise<{ discount: number; type: string }>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchCart()
    else setItems([])
  }, [user])

  async function fetchCart() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('cart_items')
        .select(`*, product:products(*, images:product_images(*))`)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      setItems((data as CartItemWithProduct[]) ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function addItem(productId: string, size: string, quantity = 1) {
    if (!user) throw new Error('Faça login para adicionar ao carrinho')
    const existing = items.find(i => i.product_id === productId && i.size === size)
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity)
    } else {
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id, product_id: productId, size, quantity,
      })
      if (error) throw error
      await fetchCart()
    }
  }

  async function removeItem(itemId: string) {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId)
    if (error) throw error
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) { await removeItem(itemId); return }
    const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
    if (error) throw error
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }

  async function clearCart() {
    if (!user) return
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    setItems([])
  }

  async function applyCoupon(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()
    if (error || !data) throw new Error('Cupom inválido ou expirado')
    if (data.expires_at && new Date(data.expires_at) < new Date()) throw new Error('Cupom expirado')
    if (data.max_uses && data.used_count >= data.max_uses) throw new Error('Cupom esgotado')
    const discount = data.discount_type === 'percent'
      ? (total * data.discount_value) / 100
      : data.discount_value
    return { discount, type: data.discount_type }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, loading, addItem, removeItem, updateQuantity, clearCart, applyCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
