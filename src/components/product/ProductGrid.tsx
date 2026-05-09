import { ProductCard } from './ProductCard'
import type { ProductWithImages } from '../../types'

interface ProductGridProps {
  products: ProductWithImages[]
  loading?: boolean
  cols?: 2 | 3 | 4
}

export function ProductGrid({ products, loading, cols = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[cols]

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-4`}>
        {[...Array(cols * 2)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-square bg-surface-2" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-surface-2 rounded w-1/2" />
              <div className="h-4 bg-surface-2 rounded w-3/4" />
              <div className="h-5 bg-surface-2 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-muted">
        <div className="text-5xl mb-3">⚽</div>
        <p>Nenhum produto encontrado</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
