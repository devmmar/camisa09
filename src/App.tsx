import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppRoutes } from './routes/AppRoutes'
import { isSupabaseConfigured } from './lib/supabase'
import camisa9Logo from './assets/camisa9_escuro.png'

function SetupScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-black border border-[#26c4c9]/20 rounded-2xl p-3 inline-flex">
            <img src={camisa9Logo} alt="Camisa 9" className="h-20 w-auto" />
          </div>
          <p className="text-white/50 mt-4">Configuração necessária</p>
        </div>
        <div className="bg-[#111111] border border-[#26c4c9]/30 rounded-2xl p-6">
          <h2 className="font-bold text-[#26c4c9] mb-3">⚙️ Configure o Supabase</h2>
          <p className="text-white/60 text-sm mb-4">
            Crie um arquivo <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-white">.env</code> na raiz do projeto com suas credenciais:
          </p>
          <pre className="bg-black rounded-lg p-4 text-sm text-[#26c4c9] mb-4 overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...`}
          </pre>
          <ol className="text-white/60 text-sm space-y-2">
            <li>1. Acesse <strong className="text-white">supabase.com</strong> e crie um projeto grátis</li>
            <li>2. Vá em <strong className="text-white">Settings → API</strong> e copie as credenciais</li>
            <li>3. Execute o arquivo <code className="bg-[#1a1a1a] px-1 rounded">supabase-schema.sql</code> no SQL Editor</li>
            <li>4. Reinicie o servidor: <code className="bg-[#1a1a1a] px-1 rounded">npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  if (!isSupabaseConfigured) return <SetupScreen />

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
