import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { supabase } from '../../lib/supabase'
import type { ProductWithImages } from '../../types'
import clsx from 'clsx'

interface ProductCardProps {
  product: ProductWithImages
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { user } = useAuth()
  const { addItem } = useCart()
  const [favorited, setFavorited] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const primaryImage = product.images?.find(i => i.is_primary) ?? product.images?.[0]
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    if (!user) return
    setFavorited(v => !v)
    if (favorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, product_id: product.id })
    }
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!product.sizes?.length) return
    setAddingToCart(true)
    try {
      await addItem(product.id, product.sizes[0])
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <Link to={`/produto/${product.slug}`} className={clsx('card group block', className)}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-6xl font-black">9</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && <span className="bg-[#26c4c9] text-black text-xs font-bold px-2 py-0.5 rounded">NOVO</span>}
          {discount > 0 && <span className="bg-[#26c4c9] text-black text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>}
          {product.stock === 0 && <span className="bg-black/70 text-white/80 text-xs px-2 py-0.5 rounded">Esgotado</span>}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {user && (
            <button
              onClick={toggleFavorite}
              className={clsx('p-2 rounded-full backdrop-blur-sm transition-colors', favorited ? 'bg-[#26c4c9] text-black' : 'bg-surface/80 text-muted hover:bg-surface')}
            >
              <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          )}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="p-2 bg-[#26c4c9] rounded-full text-black hover:brightness-90 transition-all"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {(product.team || product.category) && (
          <div className="text-xs text-muted mb-1">{product.team?.name ?? product.category?.name}</div>
        )}
        <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#26c4c9] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < 4 ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.original_price && (
            <span className="text-sm text-muted line-through">
              R$ {product.original_price.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        {product.sizes?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 5).map(size => (
              <span key={size} className="text-xs border border-base px-1.5 py-0.5 rounded text-muted">{size}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
