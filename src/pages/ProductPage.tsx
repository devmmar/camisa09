import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, MessageCircle, Star, ArrowLeft, Share2 } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { ProductReviews } from '../components/product/ProductReviews'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(slug ?? '')
  const { user } = useAuth()
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="text-5xl">⚽</div>
      <p className="text-muted">Produto não encontrado</p>
      <button onClick={() => navigate('/catalogo')} className="btn-outline">Voltar ao catálogo</button>
    </div>
  )

  const primaryImage = product.images?.find(i => i.is_primary) ?? product.images?.[0]
  const currentImage = product.images?.[selectedImage] ?? primaryImage
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  async function handleAddToCart() {
    if (!selectedSize) return
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await addItem(product!.id, selectedSize)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent(`Olá! Tenho interesse na camiseta *${product!.name}* (Tamanho: ${selectedSize || 'a definir'}) por R$ ${product!.price.toFixed(2).replace('.', ',')}. Podem me ajudar?`)
    window.open(`https://wa.me/5521979604258?text=${msg}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-[#26c4c9] mb-6 transition-colors">
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-2 mb-3">
            {currentImage ? (
              <img src={currentImage.url} alt={currentImage.alt ?? product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl font-black text-muted opacity-20">9</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-[#26c4c9]' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {(product.team || product.category) && (
            <div className="text-sm text-[#26c4c9] mb-1">{product.team?.name ?? product.category?.name}</div>
          )}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < 4 ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'} />
            ))}
            <span className="text-muted text-sm">(4.8)</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-black">R$ {product.price.toFixed(2).replace('.', ',')}</span>
            {product.original_price && (
              <>
                <span className="text-lg text-muted line-through mb-1">R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                <span className="bg-[#26c4c9] text-black text-sm font-bold px-2 py-0.5 rounded mb-1">-{discount}%</span>
              </>
            )}
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Tamanho {selectedSize && <span className="text-[#26c4c9]">— {selectedSize} selecionado</span>}
            </label>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${selectedSize === size ? 'border-[#26c4c9] bg-[#26c4c9]/10 text-[#26c4c9]' : 'border-base text-muted hover:border-[#26c4c9]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || adding || product.stock === 0}
              className={`btn-primary justify-center py-4 text-base disabled:opacity-50 ${added ? '!bg-[#1a9ca0]' : ''}`}
            >
              <ShoppingCart size={20} />
              {added ? 'Adicionado!' : product.stock === 0 ? 'Esgotado' : !selectedSize ? 'Selecione o tamanho' : adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
            </button>
            <button onClick={handleWhatsApp} className="btn-outline justify-center py-4 text-base !border-[#26c4c9]/30 hover:!border-[#26c4c9] !text-[#26c4c9]">
              <MessageCircle size={20} /> Finalizar pelo WhatsApp
            </button>
          </div>

          {product.description && (
            <div className="mt-6 pt-6 border-t border-base">
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3 text-sm text-muted">
            <Share2 size={16} />
            <span>Compartilhar</span>
            {user && (
              <>
                <span>•</span>
                <Heart size={16} />
                <span>Favoritar</span>
              </>
            )}
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
    </div>
  )
}
