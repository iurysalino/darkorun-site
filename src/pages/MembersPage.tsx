import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createMembro, getMembroByAuthUserId, getMembros, supabase, type Membro } from '@/lib/supabase'

export default function MembersPage() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [logged, setLogged] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [memberProfile, setMemberProfile] = useState<Membro | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    getMembros()
      .then(setMembros)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (user) {
        const membro = await getMembroByAuthUserId(user.id)
        if (!active) return
        setLogged(true)
        setEmail(user.email || '')
        setMemberProfile(membro)
      }
      if (active) setCheckingAuth(false)
    }

    restoreSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user
      if (!user) {
        setLogged(false)
        setMemberProfile(null)
        setCheckingAuth(false)
        return
      }

      const membro = await getMembroByAuthUserId(user.id)
      setLogged(true)
      setEmail(user.email || '')
      setMemberProfile(membro)
      setCheckingAuth(false)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogin() {
    if (!email || !password) {
      setError('Preencha e-mail e senha.')
      return
    }

    setAuthLoading(true)
    setError('')
    setSuccess('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setAuthLoading(false)
      return
    }

    const membro = data.user ? await getMembroByAuthUserId(data.user.id) : null
    setLogged(true)
    setMemberProfile(membro)
    setPassword('')
    setAuthLoading(false)
  }

  async function handleSignup() {
    if (!nome || !email || !password) {
      setError('Preencha nome, e-mail e senha.')
      return
    }

    setAuthLoading(true)
    setError('')
    setSuccess('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setAuthLoading(false)
      return
    }

    const userId = data.user?.id
    if (!userId) {
      setError('Não foi possível concluir o cadastro no momento.')
      setAuthLoading(false)
      return
    }

    await createMembro({
      nome,
      email,
      telefone: '',
      numero_membro: '',
      categoria: 'ATLETA',
      status: 'Pendente',
      eventos_participados: 0,
      data_entrada: new Date().toISOString().slice(0, 10),
      auth_user_id: userId,
    })

    setSuccess('Cadastro realizado com sucesso. Aguarde a aprovação do administrador para liberar seu acesso.')
    setPassword('')
    setNome('')
    setAuthLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setLogged(false)
    setMemberProfile(null)
    setPassword('')
  }

  if (checkingAuth) {
    return (
      <div className="bg-bg text-fg min-h-screen">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-screen">
          <p className="font-display font-bold text-sm tracking-widest text-muted">VALIDANDO ACESSO...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!logged) {
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

              {error && (
                <p className="font-body text-sm text-red-400 mb-4 border border-red-400/30 bg-red-400/10 px-4 py-2">
                  {error}
                </p>
              )}

              {success && (
                <p className="font-body text-sm text-lime mb-4 border border-lime/30 bg-lime/10 px-4 py-2">
                  {success}
                </p>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">NOME</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted"
                  />
                </div>
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">E-MAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted"
                  />
                </div>
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">SENHA</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={authLoading}
                  className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200 mt-2 disabled:opacity-50"
                >
                  ACESSAR
                </button>
                <button
                  onClick={handleSignup}
                  disabled={authLoading}
                  className="w-full border border-border text-fg font-display font-black text-sm tracking-widest py-4 hover:border-lime hover:text-lime transition-colors duration-200 disabled:opacity-50"
                >
                  CADASTRAR
                </button>
              </div>

              <p className="font-body text-xs text-muted mt-6 text-center">
                Seu acesso será liberado após aprovação do administrador.
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
        <section className="border-b border-border bg-surface">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-1">BEM-VINDO DE VOLTA</p>
                <h1 className="font-display font-black text-3xl md:text-4xl text-fg uppercase">ÁREA DO MEMBRO</h1>
              </div>
              <button
                onClick={handleLogout}
                className="border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2 hover:border-lime hover:text-lime transition-colors duration-200"
              >
                SAIR
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-surface border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-lime/10 border border-lime/30 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lime" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display font-black text-lg text-fg">{memberProfile?.nome || 'MEMBRO DK'}</p>
                  <p className="font-body text-xs text-muted">{memberProfile?.email || email}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-xs text-muted tracking-widest">CATEGORIA</span>
                  <span className="font-display font-bold text-xs text-lime tracking-widest">{memberProfile?.categoria || 'ATLETA'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-display font-bold text-xs text-muted tracking-widest">MEMBRO DESDE</span>
                  <span className="font-display font-bold text-xs text-fg tracking-widest">{memberProfile?.data_entrada || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-display font-bold text-xs text-muted tracking-widest">TREINOS</span>
                  <span className="font-display font-bold text-xs text-fg tracking-widest">{memberProfile?.eventos_participados || 0}</span>
                </div>
                {memberProfile && memberProfile.status !== 'Ativo' && (
                  <p className="font-body text-xs text-yellow-300 border border-yellow-300/30 bg-yellow-300/10 px-3 py-2">
                    Seu cadastro está pendente de aprovação. Assim que for ativado, seu acesso completo será liberado.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-surface border border-border p-6">
              <h2 className="font-display font-black text-sm tracking-widest text-lime uppercase mb-4">MEMBROS DO CLUBE</h2>
              {loading ? (
                <p className="font-body text-muted text-sm">Carregando...</p>
              ) : membros.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {membros.map((membro) => (
                    <div key={membro.id} className="flex items-center justify-between border border-border p-4 hover:border-lime transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime/10 border border-lime/30 flex items-center justify-center">
                          <span className="font-display font-black text-sm text-lime">{membro.nome.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-fg">{membro.nome}</p>
                          <p className="font-body text-xs text-muted">{membro.categoria} • {membro.status}</p>
                        </div>
                      </div>
                      <span className="font-display font-black text-[10px] tracking-widest bg-lime text-bg px-2 py-1">
                        {membro.eventos_participados || 0} EVENTOS
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