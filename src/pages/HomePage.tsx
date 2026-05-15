import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Truck, CreditCard, ShieldCheck, RefreshCw, Headphones, ChevronRight, Star } from 'lucide-react'
import { ProductGrid } from '../components/product/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import heroImg from '../assets/hero.png'

type Testimonial = { id: string; author_name: string; author_handle: string; rating: number; body: string; is_active: boolean }
type CategoryRow = { id: string; name: string; slug: string; image_url?: string; is_visible?: boolean; sort_order?: number }

const FALLBACK_CATEGORIES: CategoryRow[] = [
  { id: '1', name: 'Clubes Europeus',     slug: 'clubes-europeus'    },
  { id: '2', name: 'Clubes Brasileiros',  slug: 'clubes-brasileiros' },
  { id: '3', name: 'Seleções',            slug: 'selecoes'           },
  { id: '4', name: 'Retro & Clássicas',   slug: 'retro'              },
  { id: '5', name: 'Versão Jogador',      slug: 'versao-jogador'     },
  { id: '6', name: 'Feminina & Infantil', slug: 'feminina'           },
]

const TRUST = [
  { icon: Truck, title: 'Frete Grátis', sub: 'Acima de R$199' },
  { icon: CreditCard, title: 'Parcele em até', sub: '12x Sem Juros' },
  { icon: ShieldCheck, title: 'Compra 100%', sub: 'Segura' },
  { icon: Headphones, title: 'Atendimento Rápido', sub: 'Via WhatsApp' },
  { icon: RefreshCw, title: 'Troca', sub: 'Facilitada' },
]

const WHY = [
  { icon: ShieldCheck, title: 'Produtos de Qualidade', desc: 'Selecionamos as melhores camisetas para você.' },
  { icon: ShieldCheck, title: 'Compra Segura', desc: 'Seus dados protegidos do início ao fim da compra.' },
  { icon: Truck, title: 'Envio Rápido', desc: 'Postagem em até 24h úteis para todo o Brasil.' },
  { icon: Headphones, title: 'Atendimento Humano', desc: 'Fale com a gente sempre que precisar.' },
  { icon: RefreshCw, title: 'Troca Facilitada', desc: 'Não ficou bom? A troca é por nossa conta.' },
]

const HOW = [
  { n: '1', label: 'Escolha sua camisa' },
  { n: '2', label: 'Faça seu pedido' },
  { n: '3', label: 'Receba seu pedido' },
  { n: '4', label: 'Vista sua presença' },
]

export function HomePage() {
  const { settings } = useSiteSettings()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const { products: bestsellers, loading: loadingBest } = useProducts({ limit: 6 })
  const { products: newArrivals, loading: loadingNew } = useProducts({ isNew: true, limit: 6 })

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false })
      .then(({ data }) => setTestimonials((data as Testimonial[]) ?? []))
    supabase.from('categories').select('id, name, slug, image_url, is_visible, sort_order')
      .eq('is_visible', true).order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data?.length) setCategories(data as CategoryRow[])
      })
  }, [])

  function handleWhatsApp() {
    const num = settings.whatsapp_number ?? '5521979604258'
    window.open(`https://wa.me/${num}?text=Olá! Vim pelo site Camisa 9 e quero ver as camisetas!`, '_blank')
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-[#0a0a0a] overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(38,196,201,0.1) 0%, transparent 40%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#26c4c9]/10 border border-[#26c4c9]/30 text-[#26c4c9] text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                Futebol & Street
              </div>
              <h1 className="font-display text-7xl md:text-8xl lg:text-9xl text-white leading-none mb-2 uppercase">
                {settings.hero_line1 ?? 'Não é só camisa.'}
              </h1>
              <h2 className="font-display text-7xl md:text-8xl lg:text-9xl text-[#26c4c9] leading-none mb-8 uppercase">
                {settings.hero_line2 ?? 'É presença.'}
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-md leading-relaxed">
                {settings.hero_subtitle ?? 'Camisas de futebol com estética streetwear. Para quem vive o jogo dentro e fora das quatro linhas.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalogo" className="btn-primary text-sm px-8 py-4">
                  {settings.hero_cta1 ?? 'Ver Camisas'} <ArrowRight size={16} />
                </Link>
                <button onClick={handleWhatsApp} className="btn-whatsapp text-sm px-8 py-4">
                  <MessageCircle size={16} /> {settings.hero_cta2 ?? 'Chamar no WhatsApp'}
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex justify-center lg:justify-end">
              <img
                src={settings.hero_image_url || heroImg}
                alt="Camisa 9"
                className="w-full max-w-md lg:max-w-full h-[500px] lg:h-[680px] object-cover object-top rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent rounded-2xl lg:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TRUST.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon size={22} className="text-[#26c4c9] shrink-0" />
                <div>
                  <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">{title}</p>
                  <p className="text-white/40 text-xs leading-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorias ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Categorias</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map(cat => (
            <Link
              key={cat.id}
              to={`/catalogo?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/5 hover:border-[#26c4c9]/40 transition-all duration-300"
            >
              {cat.image_url
                ? <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                : null
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-display text-white text-base leading-tight uppercase tracking-wide">{cat.name}</p>
                <ArrowRight size={14} className="text-[#26c4c9] mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Mais Vendidos ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#26c4c9] rounded-full" />
            <div>
              <p className="text-xs text-[#26c4c9] font-bold uppercase tracking-widest mb-0.5">Top Picks</p>
              <h2 className="section-title">Mais Vendidos</h2>
            </div>
          </div>
          <Link to="/catalogo" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted hover:text-[#26c4c9] transition-colors">
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>
        <ProductGrid products={bestsellers} loading={loadingBest} />
      </section>

      {/* ── Por que comprar ── */}
      <section className="bg-[#111111] border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title mb-2">
            Por que comprar na <span className="text-[#26c4c9]">Camisa 9?</span>
          </h2>
          <p className="text-muted text-sm mb-10">Qualidade, segurança e atendimento em cada detalhe.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#26c4c9]/10 border border-[#26c4c9]/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-[#26c4c9]" />
                </div>
                <p className="font-bold text-sm uppercase tracking-wide mb-1">{title}</p>
                <p className="text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lançamentos ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#26c4c9] rounded-full" />
            <div>
              <p className="text-xs text-[#26c4c9] font-bold uppercase tracking-widest mb-0.5">Acabou de Chegar</p>
              <h2 className="section-title">Lançamentos</h2>
            </div>
          </div>
          <Link to="/catalogo?type=lancamentos" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted hover:text-[#26c4c9] transition-colors">
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loadingNew} />
      </section>

      {/* ── Sobre | Como funciona | Avaliações ── */}
      <section className="bg-[#111111] border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Sobre */}
            <div>
              <p className="text-xs text-[#26c4c9] font-bold uppercase tracking-widest mb-3">Sobre a Camisa 9</p>
              <p className="text-muted text-sm leading-relaxed mb-6">
                {settings.sobre_text ?? 'A Camisa 9 nasceu da paixão por futebol, cultura e estilo de rua. Mais que camisetas, entregamos identidade. Criamos para quem veste o futebol como presença. Da paixão para o futuro.'}
              </p>
              <Link to="/sobre" className="btn-primary !py-2.5 !px-5 text-xs">
                Conhecer mais <ArrowRight size={14} />
              </Link>
            </div>

            {/* Como funciona */}
            <div>
              <p className="text-xs text-[#26c4c9] font-bold uppercase tracking-widest mb-6">Como Funciona</p>
              <div className="grid grid-cols-2 gap-4">
                {HOW.map(({ n, label }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#26c4c9] text-black text-sm font-black flex items-center justify-center shrink-0">
                      {n}
                    </div>
                    <p className="text-sm font-semibold leading-tight pt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Avaliações */}
            <div>
              <p className="text-xs text-[#26c4c9] font-bold uppercase tracking-widest mb-6">Avaliações</p>
              <div className="space-y-3">
                {testimonials.length > 0 ? testimonials.slice(0, 2).map(t => (
                  <div key={t.id} className="card p-5">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < t.rating ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-white/20'} />
                      ))}
                    </div>
                    <p className="text-sm italic text-muted leading-relaxed mb-4">"{t.body}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#26c4c9]/20 flex items-center justify-center text-xs font-bold text-[#26c4c9]">
                        {t.author_name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs text-muted">— {t.author_handle || t.author_name}</p>
                    </div>
                  </div>
                )) : (
                  <div className="card p-5">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-[#26c4c9] fill-[#26c4c9]" />)}
                    </div>
                    <p className="text-sm italic text-muted leading-relaxed mb-4">
                      "Qualidade absurda, chegou rápido e o atendimento é fora de série!"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#26c4c9]/20 flex items-center justify-center text-xs font-bold text-[#26c4c9]">G</div>
                      <p className="text-xs text-muted">— @gabrielcariodoso</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner Promoção ── */}
      <section className="bg-[#0a0a0a] py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#26c4c9] mb-3">{settings.promo_badge ?? 'Oferta Especial'}</p>
          <h2 className="font-display text-6xl md:text-8xl text-white uppercase mb-4">{settings.promo_title ?? 'Até 40% Off'}</h2>
          <p className="text-white/50 mb-8 text-lg">{settings.promo_subtitle ?? 'Nas camisetas selecionadas. Por tempo limitado!'}</p>
          <Link to="/catalogo?type=promocoes" className="btn-primary text-sm px-10 py-4">
            {settings.promo_cta ?? 'Aproveitar Agora'} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
