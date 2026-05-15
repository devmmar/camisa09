import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { ManualSale, PaymentStatus, DeliveryStatus, SaleChannel, SaleItem } from '../../types'
import {
  Plus, Search, X, Edit2, Truck, CheckCircle, XCircle,
  CreditCard, Package, TrendingUp, Clock, ChevronDown
} from 'lucide-react'
import { SaleFormModal } from './AdminSaleForm'

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendente', paid: 'Pago', partial: 'Parcial', refunded: 'Reembolsado', cancelled: 'Cancelado',
}
const DELIVERY_LABELS: Record<DeliveryStatus, string> = {
  pending: 'Pendente', preparing: 'Preparando', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado',
}
const CHANNEL_LABELS: Record<SaleChannel, string> = {
  manual: 'Manual', whatsapp: 'WhatsApp', instagram: 'Instagram',
  loja_fisica: 'Loja Física', indicacao: 'Indicação', outro: 'Outro',
}

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  paid: 'text-[#26c4c9] bg-[#26c4c9]/10',
  partial: 'text-orange-400 bg-orange-400/10',
  refunded: 'text-blue-400 bg-blue-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
}
const DELIVERY_COLORS: Record<DeliveryStatus, string> = {
  pending: 'text-white/50 bg-white/5',
  preparing: 'text-yellow-400 bg-yellow-400/10',
  shipped: 'text-blue-400 bg-blue-400/10',
  delivered: 'text-[#26c4c9] bg-[#26c4c9]/10',
  cancelled: 'text-red-400 bg-red-400/10',
}

function fmt(v: number) { return `R$ ${v.toFixed(2).replace('.', ',')}` }
function fmtDate(s: string) { return new Date(s).toLocaleDateString('pt-BR') }

export function AdminSales() {
  const { user } = useAuth()
  const [sales, setSales] = useState<ManualSale[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | ''>('')
  const [filterDelivery, setFilterDelivery] = useState<DeliveryStatus | ''>('')
  const [filterChannel, setFilterChannel] = useState<SaleChannel | ''>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editSale, setEditSale] = useState<ManualSale | null>(null)

  const fetchSales = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('manual_sales')
      .select('*')
      .order('created_at', { ascending: false })
    setSales((data as ManualSale[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSales() }, [fetchSales])

  async function quickUpdate(id: string, patch: Partial<ManualSale>) {
    await supabase.from('manual_sales').update(patch as never).eq('id', id)
    setSales(v => v.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const thisMonth = sales.filter(s => s.created_at >= monthStart)
  const paidMonth = thisMonth.filter(s => s.payment_status === 'paid')
  const revenueMonth = paidMonth.reduce((acc, s) => acc + s.total, 0)
  const ticketMedio = paidMonth.length ? revenueMonth / paidMonth.length : 0
  const pending = sales.filter(s => s.payment_status === 'pending').length
  const shipped = sales.filter(s => s.delivery_status === 'shipped').length
  const delivered = sales.filter(s => s.delivery_status === 'delivered').length

  const filtered = sales.filter(s => {
    if (filterPayment && s.payment_status !== filterPayment) return false
    if (filterDelivery && s.delivery_status !== filterDelivery) return false
    if (filterChannel && s.sale_channel !== filterChannel) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        s.customer_name.toLowerCase().includes(q) ||
        (s.customer_phone ?? '').includes(q) ||
        s.product_model.toLowerCase().includes(q) ||
        (s.sale_code ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  function openNew() { setEditSale(null); setModalOpen(true) }
  function openEdit(s: ManualSale) { setEditSale(s); setModalOpen(true) }
  function onSaved(sale: ManualSale) {
    setSales(v => {
      const idx = v.findIndex(s => s.id === sale.id)
      return idx >= 0 ? v.map(s => s.id === sale.id ? sale : s) : [sale, ...v]
    })
    setModalOpen(false)
  }

  const SUMMARY = [
    { icon: TrendingUp, label: 'Faturamento do mês', value: fmt(revenueMonth), sub: `${paidMonth.length} vendas pagas` },
    { icon: CreditCard, label: 'Ticket médio', value: fmt(ticketMedio), sub: 'Vendas pagas' },
    { icon: Clock, label: 'Aguardando pgto.', value: String(pending), sub: 'pendentes' },
    { icon: Truck, label: 'A caminho', value: String(shipped), sub: 'enviados' },
    { icon: CheckCircle, label: 'Entregues', value: String(delivered), sub: 'concluídos' },
    { icon: Package, label: 'Vendas no mês', value: String(thisMonth.length), sub: 'este mês' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendas Manuais</h1>
          <p className="text-muted text-sm mt-0.5">Pedidos via WhatsApp, Instagram, loja física e outros canais</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Nova Venda
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {SUMMARY.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className="text-[#26c4c9]" />
              <span className="text-xs text-muted uppercase tracking-wider truncate">{label}</span>
            </div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
              placeholder="Buscar cliente, telefone, modelo, código..."
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#26c4c9]">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={filterPayment}
              onChange={e => setFilterPayment(e.target.value as PaymentStatus | '')}
              className="input-field py-2 text-sm pr-8 appearance-none cursor-pointer"
            >
              <option value="">Pagamento</option>
              {(Object.keys(PAYMENT_LABELS) as PaymentStatus[]).map(k => (
                <option key={k} value={k}>{PAYMENT_LABELS[k]}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterDelivery}
              onChange={e => setFilterDelivery(e.target.value as DeliveryStatus | '')}
              className="input-field py-2 text-sm pr-8 appearance-none cursor-pointer"
            >
              <option value="">Entrega</option>
              {(Object.keys(DELIVERY_LABELS) as DeliveryStatus[]).map(k => (
                <option key={k} value={k}>{DELIVERY_LABELS[k]}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterChannel}
              onChange={e => setFilterChannel(e.target.value as SaleChannel | '')}
              className="input-field py-2 text-sm pr-8 appearance-none cursor-pointer"
            >
              <option value="">Canal</option>
              {(Object.keys(CHANNEL_LABELS) as SaleChannel[]).map(k => (
                <option key={k} value={k}>{CHANNEL_LABELS[k]}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#26c4c9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base text-left">
                  {['Código', 'Data', 'Cliente', 'Produto', 'Tam.', 'Qtd', 'Total', 'Pagamento', 'Entrega', 'Canal', 'Ações'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-muted uppercase tracking-wider whitespace-nowrap font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-base hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#26c4c9] whitespace-nowrap">{s.sale_code ?? '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">{fmtDate(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium whitespace-nowrap">{s.customer_name}</p>
                      {s.customer_phone && <p className="text-xs text-muted">{s.customer_phone}</p>}
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      {Array.isArray(s.items) && (s.items as unknown as SaleItem[]).length > 0 ? (() => {
                        const its = s.items as unknown as SaleItem[]
                        return (
                          <>
                            <p className="truncate font-medium">{its[0].product_model}</p>
                            <p className="text-xs text-muted flex items-center gap-1">
                              {its[0].product_type}
                              {its.length > 1 && (
                                <span className="text-[#26c4c9] font-semibold">+{its.length - 1}</span>
                              )}
                            </p>
                          </>
                        )
                      })() : (
                        <>
                          <p className="truncate">{s.product_model}</p>
                          <p className="text-xs text-muted">{s.product_type}</p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {Array.isArray(s.items) && (s.items as unknown as SaleItem[]).length > 1
                        ? (s.items as unknown as SaleItem[]).map(i => i.product_size || '—').join(', ')
                        : (s.product_size ?? '—')}
                    </td>
                    <td className="px-4 py-3 text-center">{s.product_quantity}</td>
                    <td className="px-4 py-3 font-bold whitespace-nowrap">{fmt(s.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={s.payment_status}
                        onChange={e => quickUpdate(s.id, { payment_status: e.target.value as PaymentStatus })}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${PAYMENT_COLORS[s.payment_status]}`}
                      >
                        {(Object.keys(PAYMENT_LABELS) as PaymentStatus[]).map(k => (
                          <option key={k} value={k}>{PAYMENT_LABELS[k]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.delivery_status}
                        onChange={e => {
                          const v = e.target.value as DeliveryStatus
                          const patch: Partial<ManualSale> = { delivery_status: v }
                          if (v === 'shipped' && !s.shipped_at) patch.shipped_at = new Date().toISOString()
                          if (v === 'delivered' && !s.delivered_at) patch.delivered_at = new Date().toISOString()
                          quickUpdate(s.id, patch)
                        }}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${DELIVERY_COLORS[s.delivery_status]}`}
                      >
                        {(Object.keys(DELIVERY_LABELS) as DeliveryStatus[]).map(k => (
                          <option key={k} value={k}>{DELIVERY_LABELS[k]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{CHANNEL_LABELS[s.sale_channel]}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 hover:bg-surface-2 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} className="text-muted hover:text-[#26c4c9]" />
                        </button>
                        <button
                          onClick={() => quickUpdate(s.id, { payment_status: 'paid' })}
                          className="p-1.5 hover:bg-surface-2 rounded transition-colors"
                          title="Marcar como pago"
                        >
                          <CreditCard size={14} className="text-muted hover:text-[#26c4c9]" />
                        </button>
                        <button
                          onClick={() => {
                            const patch: Partial<ManualSale> = { delivery_status: 'shipped' }
                            if (!s.shipped_at) patch.shipped_at = new Date().toISOString()
                            quickUpdate(s.id, patch)
                          }}
                          className="p-1.5 hover:bg-surface-2 rounded transition-colors"
                          title="Marcar como enviado"
                        >
                          <Truck size={14} className="text-muted hover:text-[#26c4c9]" />
                        </button>
                        <button
                          onClick={() => {
                            const patch: Partial<ManualSale> = { delivery_status: 'delivered' }
                            if (!s.delivered_at) patch.delivered_at = new Date().toISOString()
                            quickUpdate(s.id, patch)
                          }}
                          className="p-1.5 hover:bg-surface-2 rounded transition-colors"
                          title="Marcar como entregue"
                        >
                          <CheckCircle size={14} className="text-muted hover:text-[#26c4c9]" />
                        </button>
                        <button
                          onClick={() => quickUpdate(s.id, { payment_status: 'cancelled', delivery_status: 'cancelled' })}
                          className="p-1.5 hover:bg-surface-2 rounded transition-colors"
                          title="Cancelar"
                        >
                          <XCircle size={14} className="text-muted hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p className="text-center text-muted py-12 text-sm">
                {sales.length === 0 ? 'Nenhuma venda cadastrada ainda.' : 'Nenhuma venda encontrada com os filtros aplicados.'}
              </p>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <SaleFormModal
          sale={editSale}
          createdBy={user?.id ?? null}
          onSaved={onSaved}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
