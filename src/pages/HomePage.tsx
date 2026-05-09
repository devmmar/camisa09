import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Star, TrendingUp } from 'lucide-react'
import { ProductGrid } from '../components/product/ProductGrid'
import { useProducts } from '../hooks/useProducts'

export function HomePage() {
  const { products: featured, loading: loadingFeatured } = useProducts({ featured: true, limit: 4 })
  const { products: newArrivals, loading: loadingNew } = useProducts({ isNew: true, limit: 4 })
  const { products: bestsellers, loading: loadingBest } = useProducts({ limit: 8 })

  return (
    <div>
      {/* Hero — sempre escuro por identidade visual */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
        {/* Acentos sutis nos cantos */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(38,196,201,0.12) 0%, transparent 40%), radial-gradient(circle at 100% 0%, rgba(38,196,201,0.08) 0%, transparent 35%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#26c4c9]/10 border border-[#26c4c9]/30 text-[#26c4c9] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} /> Nova Coleção 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-6 text-white">
              VESTE O
              <br />
              <span className="text-gradient-gold">JOGO.</span>
              <br />
              VIVE O
              <br />
              <span className="text-[#26c4c9]">ESTILO.</span>
            </h1>
            <p className="text-lg text-white/60 mb-8 max-w-lg">
              Camisetas de futebol com identidade streetwear. Do campo para a rua, do coração para o peito.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalogo" className="btn-gold">Explorar Catálogo <ArrowRight size={18} /></Link>
              <Link to="/jogos" className="border border-white/20 hover:border-white/60 hover:bg-white/5 text-white px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2">
                Jogar Agora
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-8 md:gap-16">
              {[['500+', 'Camisetas'], ['50+', 'Times'], ['10k+', 'Clientes'], ['4.9', 'Avaliação']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-[#26c4c9]">{n}</div>
                  <div className="text-xs text-white/50">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lançamentos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#26c4c9] rounded-full" />
            <div>
              <div className="text-xs text-[#26c4c9] font-semibold uppercase tracking-wider">Acabou de Chegar</div>
              <h2 className="section-title">Lançamentos</h2>
            </div>
          </div>
          <Link to="/catalogo?type=lancamentos" className="text-sm text-muted hover:text-[#26c4c9] flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loadingNew} />
      </section>

      {/* Banner promocional — sempre escuro */}
      <section className="bg-black py-16 my-8 border-y border-[#26c4c9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-[#26c4c9] mb-2">Oferta Especial</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 text-white">ATÉ 40% OFF</h2>
          <p className="text-white/60 mb-6">Nas camisetas selecionadas. Por tempo limitado!</p>
          <Link to="/catalogo?type=promocoes" className="btn-gold">Aproveitar Agora <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* Mais Vendidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#26c4c9] rounded-full" />
            <div>
              <div className="text-xs text-[#26c4c9] font-semibold uppercase tracking-wider">Favoritos dos Fãs</div>
              <h2 className="section-title flex items-center gap-2"><TrendingUp size={28} /> Mais Vendidos</h2>
            </div>
          </div>
          <Link to="/catalogo" className="text-sm text-muted hover:text-[#26c4c9] flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={bestsellers} loading={loadingBest} />
      </section>

      {/* Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-[#26c4c9] rounded-full" />
          <div>
            <div className="text-xs text-[#26c4c9] font-semibold uppercase tracking-wider">Os Melhores</div>
            <h2 className="section-title flex items-center gap-2"><Star size={28} /> Destaques</h2>
          </div>
        </div>
        <ProductGrid products={featured} loading={loadingFeatured} />
      </section>

      {/* CTA Final */}
      <section className="bg-surface-2 border-y border-base py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            QUAL CAMISA<br />COMBINA COM VOCÊ?
          </h2>
          <p className="text-muted mb-8">Faça nosso quiz e descubra sua identidade no futebol</p>
          <Link to="/jogos" className="btn-primary text-lg px-8 py-4">
            Fazer o Quiz <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
