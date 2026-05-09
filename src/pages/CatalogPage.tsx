import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductGrid } from '../components/product/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { supabase } from '../lib/supabase'
import type { Category, Team } from '../types'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [showFilters, setShowFilters] = useState(false)
  const [priceMax, setPriceMax] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const type = searchParams.get('type') ?? ''

  useEffect(() => {
    supabase.from('teams').select('*').order('name').then(({ data }) => setTeams(data ?? []))
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data ?? []))
  }, [])

  const { products, loading } = useProducts({
    search: search || undefined,
    featured: type === 'destaques' ? true : undefined,
    isNew: type === 'lancamentos' ? true : undefined,
    teamId: selectedTeam || undefined,
    categoryId: selectedCategory || undefined,
    limit: 48,
  })

  const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '1', '2', '3', '4']

  const filtered = products.filter(p => {
    if (priceMax && p.price > Number(priceMax)) return false
    if (selectedSize && !p.sizes?.includes(selectedSize)) return false
    return true
  })

  const activeFilterCount = [priceMax, selectedSize, selectedTeam, selectedCategory].filter(Boolean).length

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params: Record<string, string> = {}
    if (search) params.q = search
    if (type) params.type = type
    setSearchParams(params)
  }

  function clearFilters() {
    setPriceMax('')
    setSelectedSize('')
    setSelectedTeam('')
    setSelectedCategory('')
  }

  const typeLabels: Record<string, string> = {
    lancamentos: 'Lançamentos', promocoes: 'Promoções',
    destaques: 'Destaques', selecoes: 'Seleções', clubes: 'Clubes',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="section-title">{type ? typeLabels[type] ?? 'Catálogo' : 'Catálogo'}</h1>
        <p className="text-muted mt-1">{loading ? '...' : `${filtered.length} produtos encontrados`}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Buscar camisetas, times, seleções..."
          />
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchParams(type ? { type } : {}) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#26c4c9]">
              <X size={16} />
            </button>
          )}
        </form>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`btn-outline gap-2 shrink-0 ${activeFilterCount > 0 ? '!border-[#26c4c9] !text-[#26c4c9]' : ''}`}
        >
          <SlidersHorizontal size={18} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#26c4c9] text-black text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="card p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-2">Time</label>
              <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} className="input-field">
                <option value="">Todos os times</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-2">Categoria</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="input-field">
                <option value="">Todas as categorias</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-2">Preço máximo</label>
              <input
                type="number" value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                className="input-field" placeholder="R$ 999"
              />
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-2">Tamanho</label>
              <div className="flex gap-1.5 flex-wrap">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(v => v === s ? '' : s)}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors ${selectedSize === s ? 'border-[#26c4c9] bg-[#26c4c9]/10 text-[#26c4c9]' : 'border-base text-muted hover:border-[#26c4c9]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-muted hover:text-[#26c4c9] transition-colors mt-4">
              Limpar {activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      <ProductGrid products={filtered} loading={loading} />
    </div>
  )
}
