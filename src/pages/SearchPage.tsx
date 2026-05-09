import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { ProductGrid } from '../components/product/ProductGrid'
import { useProducts } from '../hooks/useProducts'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [input, setInput] = useState(q)

  const { products, loading } = useProducts({ search: q || undefined, limit: 48 })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) setSearchParams({ q: trimmed })
    else setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="relative max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            className="input-field pl-12 pr-10 py-3 text-base"
            placeholder="Buscar camisetas, times, seleções..."
          />
          {input && (
            <button type="button" onClick={() => { setInput(''); setSearchParams({}) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#26c4c9] transition-colors">
              <X size={18} />
            </button>
          )}
        </form>
        {q && !loading && (
          <p className="text-muted mt-3 text-sm">
            {products.length} resultado{products.length !== 1 ? 's' : ''} para <span className="font-semibold">"{q}"</span>
          </p>
        )}
      </div>

      {!q ? (
        <div className="text-center py-24 text-muted">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>Digite algo para buscar</p>
        </div>
      ) : !loading && products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">⚽</div>
          <p className="text-muted mb-6">Nenhum resultado para "{q}"</p>
          <Link to="/catalogo" className="btn-outline">Ver todos os produtos</Link>
        </div>
      ) : (
        <ProductGrid products={products} loading={loading} />
      )}
    </div>
  )
}
