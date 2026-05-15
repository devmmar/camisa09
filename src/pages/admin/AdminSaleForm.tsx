import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { ManualSale, PaymentStatus, DeliveryStatus, SaleChannel, SaleItem } from '../../types'
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react'

interface Props {
  sale: ManualSale | null
  createdBy: string | null
  onSaved: (sale: ManualSale) => void
  onClose: () => void
}

type FormState = {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  items: SaleItem[]
  discount: number
  shipping_price: number
  total: number
  payment_method: string
  payment_status: PaymentStatus
  sale_channel: SaleChannel
  delivery_status: DeliveryStatus
  tracking_code: string
  notes: string
  total_manual: boolean
}

const EMPTY_ITEM: SaleItem = {
  product_type: 'Camiseta',
  product_model: '',
  product_size: '',
  product_quantity: 1,
  unit_price: 0,
}

const EMPTY: FormState = {
  customer_name: '', customer_phone: '', customer_email: '', customer_address: '',
  items: [{ ...EMPTY_ITEM }],
  discount: 0, shipping_price: 0, total: 0,
  payment_method: 'Pix', payment_status: 'pending',
  sale_channel: 'whatsapp', delivery_status: 'pending',
  tracking_code: '', notes: '', total_manual: false,
}

function calcSubtotal(items: SaleItem[]) {
  return items.reduce((s, i) => s + i.unit_price * i.product_quantity, 0)
}

function calcTotal(f: FormState) {
  return Math.max(0, calcSubtotal(f.items) - f.discount + f.shipping_price)
}

function saleToItems(sale: ManualSale): SaleItem[] {
  if (Array.isArray(sale.items) && sale.items.length > 0) {
    return sale.items as unknown as SaleItem[]
  }
  return [{
    product_type: sale.product_type,
    product_model: sale.product_model,
    product_size: sale.product_size ?? '',
    product_quantity: sale.product_quantity,
    unit_price: sale.unit_price,
  }]
}

export function SaleFormModal({ sale, createdBy, onSaved, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sale) {
      setForm({
        customer_name: sale.customer_name,
        customer_phone: sale.customer_phone ?? '',
        customer_email: sale.customer_email ?? '',
        customer_address: sale.customer_address ?? '',
        items: saleToItems(sale),
        discount: sale.discount,
        shipping_price: sale.shipping_price,
        total: sale.total,
        payment_method: sale.payment_method ?? 'Pix',
        payment_status: sale.payment_status,
        sale_channel: sale.sale_channel,
        delivery_status: sale.delivery_status,
        tracking_code: sale.tracking_code ?? '',
        notes: sale.notes ?? '',
        total_manual: false,
      })
    }
  }, [sale])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (!next.total_manual && ['discount', 'shipping_price'].includes(key as string)) {
        next.total = calcTotal(next)
      }
      return next
    })
  }

  function setItem(idx: number, key: keyof SaleItem, value: string | number) {
    setForm(prev => {
      const items = prev.items.map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      )
      const next = { ...prev, items }
      if (!next.total_manual) next.total = calcTotal(next)
      return next
    })
  }

  function addItem() {
    setForm(prev => {
      const items = [...prev.items, { ...EMPTY_ITEM }]
      const next = { ...prev, items }
      if (!next.total_manual) next.total = calcTotal(next)
      return next
    })
  }

  function removeItem(idx: number) {
    setForm(prev => {
      const items = prev.items.filter((_, i) => i !== idx)
      const next = { ...prev, items: items.length ? items : [{ ...EMPTY_ITEM }] }
      if (!next.total_manual) next.total = calcTotal(next)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name) { setError('Nome do cliente é obrigatório.'); return }
    if (!form.items[0]?.product_model) { setError('Modelo do primeiro item é obrigatório.'); return }
    setError(''); setSaving(true)

    const firstItem = form.items[0]
    const totalQty = form.items.reduce((s, i) => s + i.product_quantity, 0)
    const summaryModel = form.items.length > 1
      ? `${firstItem.product_model} e mais ${form.items.length - 1}`
      : firstItem.product_model

    const payload = {
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || null,
      customer_email: form.customer_email || null,
      customer_address: form.customer_address || null,
      product_type: firstItem.product_type,
      product_model: summaryModel,
      product_size: form.items.length === 1 ? (firstItem.product_size || null) : null,
      product_quantity: totalQty,
      unit_price: form.items.length === 1 ? firstItem.unit_price : 0,
      items: form.items,
      discount: form.discount,
      shipping_price: form.shipping_price,
      total: form.total,
      payment_method: form.payment_method || null,
      payment_status: form.payment_status,
      sale_channel: form.sale_channel,
      delivery_status: form.delivery_status,
      tracking_code: form.tracking_code || null,
      notes: form.notes || null,
      ...(sale ? {} : { created_by: createdBy }),
    }

    try {
      if (sale) {
        const { data, error: err } = await supabase
          .from('manual_sales').update(payload as never).eq('id', sale.id).select().single()
        if (err) throw err
        onSaved(data as ManualSale)
      } else {
        const { data, error: err } = await supabase
          .from('manual_sales').insert(payload as never).select().single()
        if (err) throw err
        onSaved(data as ManualSale)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar venda.')
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, node: React.ReactNode) => (
    <div>
      <label className="block text-xs text-muted uppercase tracking-wider mb-1.5">{label}</label>
      {node}
    </div>
  )

  const inp = (key: keyof FormState, props?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      value={String(form[key])}
      onChange={e => set(key, (props?.type === 'number' ? Number(e.target.value) : e.target.value) as never)}
      className="input-field text-sm py-2"
    />
  )

  const sel = (key: keyof FormState, options: [string, string][]) => (
    <select
      value={String(form[key])}
      onChange={e => set(key, e.target.value as never)}
      className="input-field text-sm py-2"
    >
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  )

  const subtotal = calcSubtotal(form.items)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-surface border border-base rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-base sticky top-0 bg-surface z-10">
          <h2 className="font-bold text-lg">{sale ? 'Editar Venda' : 'Nova Venda'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Cliente */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#26c4c9] mb-3">Cliente</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Nome *', inp('customer_name', { placeholder: 'Nome completo', required: true }))}
              {field('WhatsApp', inp('customer_phone', { placeholder: '(21) 99999-9999' }))}
              {field('E-mail', inp('customer_email', { type: 'email', placeholder: 'email@exemplo.com' }))}
              {field('Endereço', inp('customer_address', { placeholder: 'Rua, nº, cidade' }))}
            </div>
          </div>

          {/* Itens */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#26c4c9]">
                Itens ({form.items.length})
              </p>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs text-[#26c4c9] hover:text-[#26c4c9]/80 transition-colors font-medium"
              >
                <Plus size={13} /> Adicionar item
              </button>
            </div>

            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="bg-surface-2 rounded-xl p-3 border border-base">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted">Item {idx + 1}</span>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1 hover:bg-red-500/10 rounded transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={13} className="text-muted hover:text-red-400" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-wider mb-1">Tipo</label>
                      <select
                        value={item.product_type}
                        onChange={e => setItem(idx, 'product_type', e.target.value)}
                        className="input-field text-sm py-1.5"
                      >
                        {[['Camiseta','Camiseta'],['Shorts','Shorts'],['Kit','Kit'],['Outro','Outro']].map(([v,l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-muted uppercase tracking-wider mb-1">Modelo *</label>
                      <input
                        value={item.product_model}
                        onChange={e => setItem(idx, 'product_model', e.target.value)}
                        placeholder="Ex: Brasil 1998 Home"
                        className="input-field text-sm py-1.5"
                        required={idx === 0}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-wider mb-1">Tamanho</label>
                      <input
                        value={item.product_size}
                        onChange={e => setItem(idx, 'product_size', e.target.value)}
                        placeholder="M, G, GG..."
                        className="input-field text-sm py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-wider mb-1">Qtd</label>
                      <input
                        type="number" min={1}
                        value={item.product_quantity}
                        onChange={e => setItem(idx, 'product_quantity', Number(e.target.value))}
                        className="input-field text-sm py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-wider mb-1">Valor unit. (R$)</label>
                      <input
                        type="number" min={0} step="0.01"
                        value={item.unit_price}
                        onChange={e => setItem(idx, 'unit_price', Number(e.target.value))}
                        className="input-field text-sm py-1.5"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-2 text-right">
                    Subtotal: <strong className="text-white">R$ {(item.unit_price * item.product_quantity).toFixed(2).replace('.', ',')}</strong>
                  </p>
                </div>
              ))}
            </div>

            {form.items.length > 1 && (
              <p className="text-xs text-muted mt-2 text-right">
                Subtotal dos itens: <strong className="text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</strong>
              </p>
            )}
          </div>

          {/* Valores */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#26c4c9] mb-3">Valores</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {field('Desconto (R$)', inp('discount', { type: 'number', min: 0, step: '0.01' }))}
              {field('Frete (R$)', inp('shipping_price', { type: 'number', min: 0, step: '0.01' }))}
              <div>
                <label className="block text-xs text-muted uppercase tracking-wider mb-1.5">
                  Total (R$)
                  <span className="ml-1 text-[10px] normal-case text-muted/60">
                    {form.total_manual ? 'manual' : 'calculado'}
                  </span>
                </label>
                <input
                  type="number" min={0} step="0.01"
                  value={form.total}
                  onChange={e => { set('total', Number(e.target.value)); set('total_manual', true) }}
                  className="input-field text-sm py-2"
                />
              </div>
            </div>
            <p className="text-xs text-muted mt-2">
              Total calculado: <strong>R$ {calcTotal(form).toFixed(2).replace('.', ',')}</strong>
              {form.discount > 0 && <span className="ml-2 text-[#26c4c9]">(-R$ {form.discount.toFixed(2).replace('.', ',')} desconto)</span>}
            </p>
          </div>

          {/* Pagamento & Canal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#26c4c9] mb-3">Pagamento & Canal</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {field('Método', sel('payment_method', [['Pix','Pix'],['Cartão','Cartão'],['Dinheiro','Dinheiro'],['Link','Link de Pagamento'],['Outro','Outro']]))}
              {field('Status pgto.', sel('payment_status', [['pending','Pendente'],['paid','Pago'],['partial','Parcial'],['refunded','Reembolsado'],['cancelled','Cancelado']]))}
              {field('Canal de venda', sel('sale_channel', [['manual','Manual'],['whatsapp','WhatsApp'],['instagram','Instagram'],['loja_fisica','Loja Física'],['indicacao','Indicação'],['outro','Outro']]))}
            </div>
          </div>

          {/* Entrega */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#26c4c9] mb-3">Entrega</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Status entrega', sel('delivery_status', [['pending','Pendente'],['preparing','Preparando'],['shipped','Enviado'],['delivered','Entregue'],['cancelled','Cancelado']]))}
              {field('Código de rastreio', inp('tracking_code', { placeholder: 'BR123456789BR' }))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider mb-1.5">Observações</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="input-field text-sm resize-none"
              rows={3}
              placeholder="Detalhes adicionais do pedido..."
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : <><Save size={16} /> Salvar Venda</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
