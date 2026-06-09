import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getMembros, type Membro } from '@/lib/supabase'

// Simulated auth state
function useMemberAuth() {
  const [logged, setLogged] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function login() {
    if (email && password) {
      setLogged(true)
      setError('')
    } else {
      setError('Preencha e-mail e senha.')
    }
  }

  return { logged, email, setEmail, password, setPassword, error, login, logout: () => setLogged(false) }
}

const memberEvents = [
  { name: 'DK RUN — PRIMEIRO BEAT', date: '07/06/2026', status: 'Inscrito', bib: '#042' },
]

export default function MembersPage() {
  const auth = useMemberAuth()
  const [membros, setMembros] = useState<Membro[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMembros()
      .then(setMembros)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (!auth.logged) {
    return (
      <div className="bg-bg text-fg min-h-screen">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md mx-4"
          >
            <div className="bg-surface border border-border p-8">
              <div className="mb-8">
                <span className="font-display font-black text-2xl text-fg tracking-wider">
                  DARK<span className="text-lime">Ø</span>
                </span>
                <p className="font-display font-bold text-xs tracking-[0.3em] text-muted uppercase mt-1">ÁREA DE MEMBROS</p>
              </div>

              <h1 className="font-display font-black text-3xl text-fg uppercase mb-6">ENTRAR</h1>

              {auth.error && (
                <p className="font-body text-sm text-red-400 mb-4 border border-red-400/30 bg-red-400/10 px-4 py-2">
                  {auth.error}
                </p>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">E-MAIL</label>
                  <input
                    type="email"
                    value={auth.email}
                    onChange={(e) => auth.setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted"
                  />
                </div>
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">SENHA</label>
                  <input
                    type="password"
                    value={auth.password}
                    onChange={(e) => auth.setPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === 'Enter' && auth.login()}
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted"
                  />
                </div>
                <button
                  onClick={auth.login}
                  className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200 mt-2"
                >
                  ACESSAR
                </button>
              </div>

              <p className="font-body text-xs text-muted mt-6 text-center">
                Ainda não é membro?{' '}
                <a href="https://inscricoesroraima.com.br" target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">
                  Inscreva-se aqui
                </a>
              </p>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-bg text-fg min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="border-b border-border bg-surface">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-1">BEM-VINDO DE VOLTA</p>
                <h1 className="font-display font-black text-3xl md:text-4xl text-fg uppercase">ÁREA DO MEMBRO</h1>
              </div>
              <button
                onClick={auth.logout}
                className="border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2 hover:border-lime hover:text-lime transition-colors duration-200"
              >
                SAIR
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="bg-surface border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-lime/10 border border-lime/30 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lime" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display font-black text-lg text-fg">MEMBRO DK</p>
                  <p className="font-body text-xs text-muted">{auth.email}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-xs text-muted tracking-widest">CATEGORIA</span>
                  <span className="font-display font-bold text-xs text-lime tracking-widest">ATLETA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-display font-bold text-xs text-muted tracking-widest">MEMBRO DESDE</span>
                  <span className="font-display font-bold text-xs text-fg tracking-widest">2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-display font-bold text-xs text-muted tracking-widest">TREINOS</span>
                  <span className="font-display font-bold text-xs text-fg tracking-widest">12</span>
                </div>
              </div>
            </div>

            {/* Members list from Supabase */}
            <div className="lg:col-span-2 bg-surface border border-border p-6">
              <h2 className="font-display font-black text-sm tracking-widest text-lime uppercase mb-4">MEMBROS DO CLUBE</h2>
              {loading ? (
                <p className="font-body text-muted text-sm">Carregando...</p>
              ) : membros.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {membros.map((m) => (
                    <div key={m.id} className="flex items-center justify-between border border-border p-4 hover:border-lime transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime/10 border border-lime/30 flex items-center justify-center">
                          <span className="font-display font-black text-sm text-lime">{m.nome.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-fg">{m.nome}</p>
                          <p className="font-body text-xs text-muted">{m.categoria} • {m.status}</p>
                        </div>
                      </div>
                      <span className="font-display font-black text-[10px] tracking-widest bg-lime text-bg px-2 py-1">
                        {m.eventos_participados} EVENTOS
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-body text-muted text-sm">Nenhum membro encontrado.</p>
              )}
              <Link
                to="/eventos"
                className="mt-4 inline-flex items-center gap-2 border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2.5 hover:border-lime hover:text-lime transition-colors duration-200"
              >
                VER PRÓXIMOS EVENTOS
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
