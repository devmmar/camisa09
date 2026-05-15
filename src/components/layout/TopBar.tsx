import { Truck, CreditCard } from 'lucide-react'

export function TopBar() {
  return (
    <div className="bg-[#0a0a0a] border-b border-white/5 text-white text-xs py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Truck size={13} className="text-[#26c4c9] shrink-0" />
          <span className="font-medium uppercase tracking-wider">Frete grátis para todo o Brasil acima de R$199</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <CreditCard size={13} className="text-[#26c4c9] shrink-0" />
          <span className="font-medium uppercase tracking-wider">Parcele em até 12x sem juros</span>
        </div>
      </div>
    </div>
  )
}
