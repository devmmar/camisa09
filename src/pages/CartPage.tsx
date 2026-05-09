import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, MessageCircle, Tag, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

type Step = 'cart' | 'checkout'

export function CartPage() {
  const { items, total, removeItem, updateQuantity, applyCoupon, clearCart } = useCart()
  const [step, setStep] = useState<Step>('cart')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  async function handleApplyCoupon() {
    setCouponError('')
    setApplyingCoupon(true)
    try {
      const result = await applyCoupon(couponCode)
      setDiscount(result.discount)
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Cupom inválido')
    } finally {
      setApplyingCoupon(false)
    }
  }

  function handleWhatsApp() {
    const itemsText = items.map(i =>
      `• ${i.product.name} (${i.size}) x${i.quantity} = R$ ${(i.product.price * i.quantity).toFixed(2).replace('.', ',')}`
    ).join('\n')
    const finalTotal = (total - discount).toFixed(2).replace('.', ',')
    const header = name ? `*Pedido de ${name}*\n${phone ? `Tel: ${phone}\n` : ''}${address ? `Endereço: ${address}\n` : ''}\n` : ''
    const footer = notes ? `\nObservações: ${notes}\n` : ''
    const msg = encodeURIComponent(
      `${header}${itemsText}\n${footer}\n${discount > 0 ? `Desconto: -R$ ${discount.toFixed(2).replace('.', ',')}\n` : ''}*Total: R$ ${finalTotal}*`
    )
    window.open(`https://wa.me/5521979604258?text=${msg}`, '_blank')
  }

  const finalTotal = total - discount

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Carrinho vazio</h2>
        <p className="text-muted mb-6">Adicione camisetas ao carrinho para continuar</p>
        <Link to="/catalogo" className="btn-primary">Explorar catálogo</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 'cart' ? 'text-[#26c4c9]' : 'text-muted'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'cart' ? 'bg-[#26c4c9] text-black' : 'bg-[#26c4c9]/20 text-[#26c4c9]'}`}>
            {step === 'checkout' ? <CheckCircle size={14} /> : '1'}
          </div>
          Carrinho
        </div>
        <div className="flex-1 h-px bg-border-base" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 'checkout' ? 'text-[#26c4c9]' : 'text-muted'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'checkout' ? 'bg-[#26c4c9] text-black' : 'bg-surface-2 text-muted'}`}>
            2
          </div>
          Confirmar
        </div>
      </div>

      {step === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const img = item.product.images?.find(i => i.is_primary) ?? item.product.images?.[0]
              return (
                <div key={item.id} className="card p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                    {img ? <img src={img.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted font-black">9</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                    <p className="text-muted text-xs mt-0.5">Tamanho: {item.size}</p>
                    <p className="font-bold mt-1">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-base flex items-center justify-center hover:border-[#26c4c9] transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-base flex items-center justify-center hover:border-[#26c4c9] transition-colors">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-2 text-muted hover:text-[#26c4c9] transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            <button onClick={clearCart} className="text-sm text-muted hover:text-[#26c4c9] transition-colors">Limpar carrinho</button>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold mb-4">Resumo do pedido</h3>
              <div className="flex gap-2 mb-2">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="input-field text-sm py-2" placeholder="Código do cupom" />
                <button onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode} className="btn-outline !px-3 !py-2 text-sm shrink-0 disabled:opacity-50">
                  <Tag size={16} />
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mb-2">{couponError}</p>}
              {discount > 0 && <p className="text-[#26c4c9] text-xs mb-3">Desconto de R$ {discount.toFixed(2).replace('.', ',')} aplicado!</p>}

              <div className="space-y-2 text-sm border-t border-base pt-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#26c4c9]">
                    <span>Desconto</span>
                    <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-base">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button onClick={() => setStep('checkout')} className="btn-primary w-full justify-center mt-4 py-4">
                Continuar <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Dados para entrega</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nome completo *</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Seu nome" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">WhatsApp *</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="(21) 99999-9999" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Endereço de entrega</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} className="input-field" placeholder="Rua, número, bairro, cidade" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Observações</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field resize-none min-h-20" placeholder="Complemento, ponto de referência, etc." />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold mb-4">Confirmar pedido</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted truncate mr-2">{item.product.name} ({item.size}) x{item.quantity}</span>
                    <span className="shrink-0">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-base pt-3 space-y-1 text-sm">
                {discount > 0 && (
                  <div className="flex justify-between text-[#26c4c9]">
                    <span>Desconto</span>
                    <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                disabled={!name || !phone}
                className="btn-primary w-full justify-center mt-4 py-4 disabled:opacity-50"
              >
                <MessageCircle size={20} /> Finalizar pelo WhatsApp
              </button>
              <p className="text-center text-xs text-muted mt-2">Você será redirecionado para o WhatsApp</p>

              <button onClick={() => setStep('cart')} className="w-full mt-3 flex items-center justify-center gap-1 text-sm text-muted hover:text-[#26c4c9] transition-colors">
                <ArrowLeft size={14} /> Voltar ao carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
