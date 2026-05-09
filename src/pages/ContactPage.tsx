import { MessageCircle, Mail } from 'lucide-react'

export function ContactPage() {
  function handleWhatsApp() {
    window.open('https://wa.me/5521979604258?text=Ol%C3%A1!%20Vim%20pelo%20site%20Camisa%209%20e%20preciso%20de%20ajuda.', '_blank')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="section-title mb-3">Fale Conosco</h1>
        <p className="text-muted">Estamos aqui para ajudar. Entre em contato por qualquer canal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <button onClick={handleWhatsApp} className="card p-6 text-center hover:border-[#26c4c9]/40 transition-colors group">
          <MessageCircle size={32} className="mx-auto text-[#26c4c9] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">WhatsApp</h3>
          <p className="text-muted text-sm">Atendimento rápido</p>
        </button>
        <a href="mailto:contato@camisa9.com.br" className="card p-6 text-center hover:border-[#26c4c9]/40 transition-colors group block">
          <Mail size={32} className="mx-auto text-[#26c4c9] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">E-mail</h3>
          <p className="text-muted text-sm">contato@camisa9.com.br</p>
        </a>
        <a href="#" className="card p-6 text-center hover:border-[#26c4c9]/40 transition-colors group block">
          <span className="text-3xl font-black text-[#26c4c9] block mb-3 group-hover:scale-110 transition-transform">IG</span>
          <h3 className="font-semibold mb-1">Instagram</h3>
          <p className="text-muted text-sm">@camisa9oficial</p>
        </a>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-bold mb-2">Horário de atendimento</h2>
        <p className="text-muted text-sm mb-2">Segunda a sexta: 9h às 18h | Sábado: 9h às 13h</p>
        <p className="text-muted text-sm">Respondemos todas as mensagens em até 24 horas úteis.</p>
      </div>
    </div>
  )
}
