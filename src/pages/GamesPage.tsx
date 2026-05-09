import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, RotateCw, Shirt, Trophy } from 'lucide-react'

const QUIZ_QUESTIONS = [
  { q: 'Seu time favorito joga na...', options: ['Primeira divisão nacional', 'Liga europeia', 'Seleção brasileira', 'Qualquer um que ganhe'] },
  { q: 'Você prefere...', options: ['Camiseta do jogo vintage', 'Lançamento oficial da temporada', 'Retrô dos anos 90', 'Edição limitada exclusiva'] },
  { q: 'Seu estilo de rua é mais...', options: ['Básico e clean', 'Oversized streetwear', 'Sporty e colorido', 'Dark e minimalista'] },
]

const QUIZ_RESULTS = [
  { title: 'O Clássico', desc: 'Você é fã das camisetas tradicionais. Prefere a elegância dos grandes clubes, autenticidade acima de tudo.', link: '/catalogo?type=clubes' },
  { title: 'O Mundial', desc: 'Você curte seleções e jogos grandes. Vestir o amarelo ou a azurra é seu sonho.', link: '/catalogo?type=selecoes' },
  { title: 'O Retrô', desc: 'Os anos 90 te chamam. Nada melhor que uma camisa vintage com história.', link: '/catalogo?type=lancamentos' },
  { title: 'O Street', desc: 'Você mistura o futebol com a moda das ruas. Camisa com calça larga e tênis é o look perfeito.', link: '/catalogo' },
]

const SPIN_PRIZES = ['5% OFF', '10% OFF', '15% OFF', 'Frete Grátis', 'Brinde', '20% OFF']
const SPIN_COLORS = ['#26c4c9', '#000000', '#1a9ca0', '#1a1a1a', '#26c4c9', '#000000']

const LEGENDS = [
  { name: 'Ronaldo Fenômeno', club: 'Brasil / Real Madrid', era: '1993-2011', shirt: '9', emoji: '⚽' },
  { name: 'Zidane', club: 'França / Real Madrid', era: '1989-2006', shirt: '10', emoji: '🎯' },
  { name: 'Ronaldinho', club: 'Brasil / Barcelona', era: '1998-2015', shirt: '10', emoji: '😁' },
  { name: 'Messi', club: 'Argentina / Barcelona', era: '2003-atual', shirt: '10', emoji: '🐐' },
]

export function GamesPage() {
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizResult, setQuizResult] = useState<typeof QUIZ_RESULTS[0] | null>(null)

  function answerQuiz(idx: number) {
    const answers = [...quizAnswers, idx]
    if (quizStep + 1 < QUIZ_QUESTIONS.length) {
      setQuizAnswers(answers)
      setQuizStep(v => v + 1)
    } else {
      setQuizResult(QUIZ_RESULTS[answers.reduce((a, b) => a + b, 0) % QUIZ_RESULTS.length])
    }
  }

  function resetQuiz() { setQuizStep(0); setQuizAnswers([]); setQuizResult(null) }

  const [spinning, setSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  function spinRoulette() {
    if (spinning) return
    setSpinning(true)
    setSpinResult(null)
    const spins = 5 + Math.floor(Math.random() * 5)
    const segment = Math.floor(Math.random() * SPIN_PRIZES.length)
    const newRotation = rotation + spins * 360 + segment * (360 / SPIN_PRIZES.length)
    setRotation(newRotation)
    setTimeout(() => { setSpinResult(SPIN_PRIZES[segment]); setSpinning(false) }, 3000)
  }

  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="section-title mb-2">Zona de Jogos</h1>
        <p className="text-muted">Interações exclusivas para o verdadeiro fã</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quiz */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shirt size={20} className="text-[#26c4c9]" />
            <h2 className="font-bold text-lg">Quiz: Qual camisa é sua?</h2>
          </div>

          {quizResult ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">⚽</div>
              <h3 className="text-2xl font-black text-[#26c4c9] mb-2">{quizResult.title}</h3>
              <p className="text-muted text-sm mb-5">{quizResult.desc}</p>
              <Link to={quizResult.link} className="btn-primary mb-3">Ver camisetas para mim</Link>
              <br />
              <button onClick={resetQuiz} className="text-sm text-muted hover:text-[#26c4c9] transition-colors mt-3">Refazer quiz</button>
            </div>
          ) : (
            <div>
              <div className="flex gap-1 mb-4">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= quizStep ? 'bg-[#26c4c9]' : 'bg-surface-2'}`} />
                ))}
              </div>
              <p className="font-medium mb-4">{QUIZ_QUESTIONS[quizStep].q}</p>
              <div className="space-y-2">
                {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                  <button key={i} onClick={() => answerQuiz(i)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-base hover:border-[#26c4c9] hover:bg-[#26c4c9]/5 text-sm transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Roulette */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <RotateCw size={20} className="text-[#26c4c9]" />
            <h2 className="font-bold text-lg">Roleta de Desconto</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full transition-transform duration-[3000ms] ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
                {SPIN_PRIZES.map((prize, i) => {
                  const angle = (360 / SPIN_PRIZES.length) * i
                  const rad = (angle * Math.PI) / 180
                  const rad2 = ((angle + 360 / SPIN_PRIZES.length) * Math.PI) / 180
                  const x1 = 100 + 80 * Math.cos(rad), y1 = 100 + 80 * Math.sin(rad)
                  const x2 = 100 + 80 * Math.cos(rad2), y2 = 100 + 80 * Math.sin(rad2)
                  const mx = 100 + 55 * Math.cos((rad + rad2) / 2)
                  const my = 100 + 55 * Math.sin((rad + rad2) / 2)
                  return (
                    <g key={i}>
                      <path d={`M100,100 L${x1},${y1} A80,80 0 0,1 ${x2},${y2} Z`} fill={SPIN_COLORS[i]} />
                      <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="bold" transform={`rotate(${angle + 30}, ${mx}, ${my})`}>{prize}</text>
                    </g>
                  )
                })}
                <circle cx="100" cy="100" r="12" fill="var(--color-surface)" />
              </svg>
              <div className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-4 w-4 h-4 bg-surface rounded-sm rotate-45 border border-base" />
            </div>
            {spinResult ? (
              <div className="text-center">
                <div className="text-[#26c4c9] text-2xl font-black">{spinResult}</div>
                <p className="text-muted text-xs mt-1">Use o código RODADA no checkout</p>
              </div>
            ) : (
              <p className="text-muted text-sm mb-3">Gire para ganhar um desconto!</p>
            )}
            <button onClick={spinRoulette} disabled={spinning} className="btn-gold mt-3 disabled:opacity-50">
              <Zap size={16} /> {spinning ? 'Girando...' : spinResult ? 'Girar novamente' : 'Girar!'}
            </button>
          </div>
        </div>

        {/* Player Cards */}
        <div className="card p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={20} className="text-[#26c4c9]" />
            <h2 className="font-bold text-lg">Cards dos Lendários</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LEGENDS.map((legend, i) => (
              <button key={i} onClick={() => setFlipped(v => ({ ...v, [i]: !v[i] }))}
                className="aspect-[3/4] rounded-xl overflow-hidden relative cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                <div className="w-full h-full transition-transform duration-500 relative" style={{ transformStyle: 'preserve-3d', transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#26c4c9] to-black flex flex-col items-center justify-center p-3" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="text-5xl mb-2">{legend.emoji}</div>
                    <div className="text-4xl font-black text-white/10">{legend.shirt}</div>
                    <div className="text-xs text-white font-bold mt-1">TOQUE PARA VER</div>
                  </div>
                  <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center p-3 text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="text-2xl mb-2">#{legend.shirt}</div>
                    <div className="font-bold text-sm">{legend.name}</div>
                    <div className="text-xs text-muted mt-1">{legend.club}</div>
                    <div className="text-xs text-[#26c4c9] mt-1">{legend.era}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
