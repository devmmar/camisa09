export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black uppercase mb-4">
          CAMISA<span className="text-[#26c4c9]">9</span>
        </h1>
        <p className="text-xl text-muted">Onde o futebol encontra o streetwear</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Nossa história</h2>
          <p className="text-muted leading-relaxed">
            A Camisa 9 nasceu da paixão pelo futebol e pelo estilo das ruas. Somos um grupo de fanáticos por camisetas que cansou de ver peças sem identidade e resolveu criar algo diferente — peças que contam histórias, que conectam gerações, que misturam a arquibancada com a calçada.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Nossa missão</h2>
          <p className="text-muted leading-relaxed">
            Trazer as melhores camisetas de futebol com um toque street genuíno. Não vendemos só camisas — vendemos identidade, pertencimento, cultura. Cada peça é selecionada pensando no nosso cliente: jovem, estiloso, apaixonado pelo jogo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 card p-8">
        {[['500+', 'Camisetas'], ['50+', 'Times'], ['10k+', 'Clientes felizes'], ['4.9★', 'Avaliação média']].map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="text-3xl font-black text-[#26c4c9]">{n}</div>
            <div className="text-sm text-muted mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
