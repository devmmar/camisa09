import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface ReviewRow {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profile: { full_name: string | null } | null
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { fetchReviews() }, [productId])

  async function fetchReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*, profile:profiles(full_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setReviews((data as unknown as ReviewRow[]) ?? [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    await supabase.from('reviews').upsert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    } as never)
    setComment('')
    setSubmitted(true)
    await fetchReviews()
    setSubmitting(false)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="mt-8 pt-8 border-t border-base">
      <h3 className="font-bold text-lg mb-4">
        Avaliações {reviews.length > 0 && <span className="text-muted font-normal text-base">({reviews.length})</span>}
      </h3>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6 p-4 card">
          <span className="text-4xl font-black">{avg.toFixed(1)}</span>
          <div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.round(avg) ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'} />
              ))}
            </div>
            <p className="text-xs text-muted mt-0.5">
              {reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''}
            </p>
          </div>
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="card p-4 mb-6">
          <p className="text-sm font-medium mb-3">Deixe sua avaliação</p>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n} type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
              >
                <Star size={26}
                  className={n <= (hoverRating || rating) ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="input-field text-sm resize-none min-h-20 w-full"
            placeholder="Conte sua experiência com este produto (opcional)"
          />
          <button type="submit" disabled={submitting} className={`btn-primary mt-3 disabled:opacity-50 ${submitted ? '!bg-[#1a9ca0]' : ''}`}>
            {submitted ? 'Avaliação enviada!' : submitting ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </form>
      ) : (
        <div className="card p-4 mb-6 text-center text-sm text-muted">
          <Link to="/login" className="text-[#26c4c9] hover:underline">Faça login</Link> para avaliar este produto
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map(r => (
            <div key={r.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#26c4c9]/20 flex items-center justify-center text-sm font-bold text-[#26c4c9] shrink-0">
                {(r.profile?.full_name?.[0] ?? 'U').toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{r.profile?.full_name ?? 'Usuário'}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? 'text-[#26c4c9] fill-[#26c4c9]' : 'text-muted'} />
                    ))}
                  </div>
                  <span className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                {r.comment && <p className="text-sm text-muted mt-1">{r.comment}</p>}
              </div>
            </div>
          ))}
          {!reviews.length && (
            <p className="text-muted text-sm py-4">Nenhuma avaliação ainda. Seja o primeiro!</p>
          )}
        </div>
      )}
    </div>
  )
}
