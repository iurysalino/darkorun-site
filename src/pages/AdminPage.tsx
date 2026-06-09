import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  getEventos, createEvento, updateEvento, deleteEvento,
  getTreinos, createTreino, updateTreino, deleteTreino,
  getMembros, createMembro, updateMembro, deleteMembro,
  getGaleria, createGaleriaItem, deleteGaleriaItem,
  uploadImage,
  type Evento, type Treino, type Membro, type GaleriaItem,
} from '@/lib/supabase'

function useAdminAuth() {
  const [logged, setLogged] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function login() {
    if (email === 'admin' && password === 'admin123') {
      setLogged(true)
      setError('')
    } else {
      setError('Credenciais inválidas. Use admin / admin123 para demo.')
    }
  }

  return { logged, email, setEmail, password, setPassword, error, login, logout: () => setLogged(false) }
}

type AdminTab = 'dashboard' | 'membros' | 'eventos' | 'galeria' | 'treinos'

// ─── Reusable Modal ───
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-bg/90 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-display font-black text-lg text-fg uppercase">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-lime">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

// ─── Input Field ───
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">{label}</label>
      {children}
    </div>
  )
}

export default function AdminPage() {
  const auth = useAdminAuth()
  const [tab, setTab] = useState<AdminTab>('dashboard')

  // Data states
  const [eventos, setEventos] = useState<Evento[]>([])
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [membros, setMembros] = useState<Membro[]>([])
  const [galeria, setGaleria] = useState<GaleriaItem[]>([])
  const [loading, setLoading] = useState(false)

  // Modal states
  const [modal, setModal] = useState<{ type: AdminTab; item?: any } | null>(null)

  useEffect(() => {
    if (auth.logged) loadAll()
  }, [auth.logged])

  async function loadAll() {
    setLoading(true)
    try {
      const [ev, tr, mem, gal] = await Promise.all([
        getEventos(), getTreinos(), getMembros(), getGaleria(),
      ])
      setEventos(ev)
      setTreinos(tr)
      setMembros(mem)
      setGaleria(gal)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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
                <p className="font-display font-bold text-xs tracking-[0.3em] text-muted uppercase mt-1">ÁREA ADMINISTRATIVA</p>
              </div>
              <h1 className="font-display font-black text-3xl text-fg uppercase mb-6">ADMIN</h1>
              {auth.error && (
                <p className="font-body text-sm text-red-400 mb-4 border border-red-400/30 bg-red-400/10 px-4 py-2">{auth.error}</p>
              )}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">USUÁRIO</label>
                  <input type="text" value={auth.email} onChange={(e) => auth.setEmail(e.target.value)} placeholder="admin"
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted" />
                </div>
                <div>
                  <label className="font-display font-bold text-xs tracking-widest text-muted uppercase block mb-2">SENHA</label>
                  <input type="password" value={auth.password} onChange={(e) => auth.setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && auth.login()}
                    className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted" />
                </div>
                <button onClick={auth.login} className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200 mt-2">ENTRAR</button>
              </div>
              <p className="font-body text-xs text-muted mt-4 text-center">Demo: admin / admin123</p>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'membros', label: 'MEMBROS' },
    { id: 'eventos', label: 'EVENTOS' },
    { id: 'galeria', label: 'GALERIA' },
    { id: 'treinos', label: 'TREINOS' },
  ]

  // ─── CRUD Helpers ───
  async function handleDeleteEvento(id: string) {
    if (!confirm('Tem certeza?')) return
    await deleteEvento(id)
    setEventos(eventos.filter(e => e.id !== id))
  }

  async function handleDeleteTreino(id: string) {
    if (!confirm('Tem certeza?')) return
    await deleteTreino(id)
    setTreinos(treinos.filter(t => t.id !== id))
  }

  async function handleDeleteMembro(id: string) {
    if (!confirm('Tem certeza?')) return
    await deleteMembro(id)
    setMembros(membros.filter(m => m.id !== id))
  }

  async function handleDeleteGaleria(id: string) {
    if (!confirm('Tem certeza?')) return
    await deleteGaleriaItem(id)
    setGaleria(galeria.filter(g => g.id !== id))
  }

  return (
    <div className="bg-bg text-fg min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="border-b border-border bg-surface">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-1">PAINEL ADMINISTRATIVO</p>
                <h1 className="font-display font-black text-2xl text-fg uppercase">DARKØ RUN CLUB</h1>
              </div>
              <button onClick={auth.logout} className="border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2 hover:border-lime hover:text-lime transition-colors duration-200">SAIR</button>
            </div>
            <div className="flex gap-1 mt-6 overflow-x-auto">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`font-display font-black text-xs tracking-widest px-5 py-2.5 whitespace-nowrap transition-colors duration-200 ${tab === t.id ? 'bg-lime text-bg' : 'border border-border text-muted hover:border-lime hover:text-lime'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          {loading && <p className="font-display font-bold text-muted text-sm tracking-widest">CARREGANDO...</p>}

          {/* ─── DASHBOARD ─── */}
          {tab === 'dashboard' && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'MEMBROS', value: membros.length },
                  { label: 'EVENTOS', value: eventos.length },
                  { label: 'TREINOS', value: treinos.length },
                  { label: 'FOTOS', value: galeria.length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface border border-border p-5">
                    <p className="font-display font-bold text-[10px] tracking-widest text-muted uppercase mb-2">{stat.label}</p>
                    <p className="font-display font-black text-3xl text-lime">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── EVENTOS CRUD ─── */}
          {tab === 'eventos' && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-xl text-fg uppercase">EVENTOS</h2>
                <button onClick={() => setModal({ type: 'eventos' })} className="bg-lime text-bg font-display font-black text-xs tracking-widest px-5 py-2.5 hover:bg-lime-dark transition-colors duration-200">+ NOVO EVENTO</button>
              </div>
              <div className="flex flex-col gap-4">
                {eventos.map((ev) => (
                  <div key={ev.id} className="bg-surface border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-display font-black text-sm text-fg">{ev.nome}</p>
                      <p className="font-body text-xs text-muted mt-1">{ev.data} • {ev.local}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-display font-black text-[10px] tracking-widest px-2 py-1 ${ev.status === 'inscricoes_abertas' ? 'bg-lime text-bg' : 'border border-border text-muted'}`}>
                        {ev.status.toUpperCase()}
                      </span>
                      <button onClick={() => setModal({ type: 'eventos', item: ev })} className="border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2 hover:border-lime hover:text-lime transition-colors duration-200">EDITAR</button>
                      <button onClick={() => handleDeleteEvento(ev.id)} className="border border-red-400/30 text-red-400 font-display font-bold text-xs tracking-widest px-4 py-2 hover:bg-red-400/10 transition-colors duration-200">EXCLUIR</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── TREINOS CRUD ─── */}
          {tab === 'treinos' && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-xl text-fg uppercase">TREINOS</h2>
                <button onClick={() => setModal({ type: 'treinos' })} className="bg-lime text-bg font-display font-black text-xs tracking-widest px-5 py-2.5 hover:bg-lime-dark transition-colors duration-200">+ NOVO TREINO</button>
              </div>
              <div className="flex flex-col gap-4">
                {treinos.map((tr) => (
                  <div key={tr.id} className="bg-surface border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-display font-black text-sm text-fg">{tr.dia_completo} • {tr.local}</p>
                      <p className="font-body text-xs text-muted mt-1">{tr.hora} • {tr.nivel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setModal({ type: 'treinos', item: tr })} className="border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2 hover:border-lime hover:text-lime transition-colors duration-200">EDITAR</button>
                      <button onClick={() => handleDeleteTreino(tr.id)} className="border border-red-400/30 text-red-400 font-display font-bold text-xs tracking-widest px-4 py-2 hover:bg-red-400/10 transition-colors duration-200">EXCLUIR</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── MEMBROS CRUD ─── */}
          {tab === 'membros' && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-xl text-fg uppercase">MEMBROS</h2>
                <button onClick={() => setModal({ type: 'membros' })} className="bg-lime text-bg font-display font-black text-xs tracking-widest px-5 py-2.5 hover:bg-lime-dark transition-colors duration-200">+ NOVO MEMBRO</button>
              </div>
              <div className="bg-surface border border-border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['NOME', 'E-MAIL', 'STATUS', 'EVENTOS', 'AÇÕES'].map((h) => (
                        <th key={h} className="font-display font-bold text-[10px] tracking-widest text-muted text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {membros.map((m) => (
                      <tr key={m.id} className="border-b border-border hover:bg-bg/50 transition-colors duration-200">
                        <td className="font-display font-bold text-sm text-fg px-4 py-3">{m.nome}</td>
                        <td className="font-body text-sm text-muted px-4 py-3">{m.email}</td>
                        <td className="px-4 py-3">
                          <span className={`font-display font-black text-[10px] tracking-widest px-2 py-1 ${m.status === 'Ativo' ? 'bg-lime text-bg' : 'border border-border text-muted'}`}>
                            {m.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="font-display font-bold text-sm text-fg px-4 py-3">{m.eventos_participados}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => setModal({ type: 'membros', item: m })} className="font-display font-bold text-xs text-muted hover:text-lime transition-colors duration-200 tracking-widest">EDITAR</button>
                          <button onClick={() => handleDeleteMembro(m.id)} className="font-display font-bold text-xs text-red-400 hover:text-red-300 transition-colors duration-200 tracking-widest">EXCLUIR</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── GALERIA CRUD ─── */}
          {tab === 'galeria' && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-xl text-fg uppercase">GALERIA</h2>
                <button onClick={() => setModal({ type: 'galeria' })} className="bg-lime text-bg font-display font-black text-xs tracking-widest px-5 py-2.5 hover:bg-lime-dark transition-colors duration-200">+ NOVA FOTO</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galeria.map((g) => (
                  <div key={g.id} className="bg-surface border border-border p-3">
                    {g.imagem_url ? (
                      <img src={g.imagem_url} alt={g.titulo} className="w-full h-32 object-cover mb-2" />
                    ) : (
                      <div className="w-full h-32 bg-surface-2 flex items-center justify-center mb-2">
                        <span className="font-display font-bold text-xs text-muted">SEM IMAGEM</span>
                      </div>
                    )}
                    <p className="font-display font-bold text-xs text-fg">{g.titulo}</p>
                    <p className="font-body text-[10px] text-muted">{g.categoria}</p>
                    <button onClick={() => handleDeleteGaleria(g.id)} className="mt-2 text-red-400 font-display font-bold text-[10px] tracking-widest hover:text-red-300">EXCLUIR</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      </main>

      {/* ─── MODAIS ─── */}
      {modal?.type === 'eventos' && (
        <EventoModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            if (modal.item) {
              const updated = await updateEvento(modal.item.id, data)
              setEventos(eventos.map(e => e.id === updated.id ? updated : e))
            } else {
              const created = await createEvento(data)
              setEventos([...eventos, created])
            }
            setModal(null)
          }}
        />
      )}

      {modal?.type === 'treinos' && (
        <TreinoModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            if (modal.item) {
              const updated = await updateTreino(modal.item.id, data)
              setTreinos(treinos.map(t => t.id === updated.id ? updated : t))
            } else {
              const created = await createTreino(data)
              setTreinos([...treinos, created])
            }
            setModal(null)
          }}
        />
      )}

      {modal?.type === 'membros' && (
        <MembroModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            if (modal.item) {
              const updated = await updateMembro(modal.item.id, data)
              setMembros(membros.map(m => m.id === updated.id ? updated : m))
            } else {
              const created = await createMembro(data)
              setMembros([...membros, created])
            }
            setModal(null)
          }}
        />
      )}

      {modal?.type === 'galeria' && (
        <GaleriaModal
          eventos={eventos}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            const created = await createGaleriaItem(data)
            setGaleria([...galeria, created])
            setModal(null)
          }}
        />
      )}

      <Footer />
    </div>
  )
}

// ─── Evento Modal ───
function EventoModal({ item, onClose, onSave }: { item?: Evento; onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({
    nome: item?.nome || '',
    subtitulo: item?.subtitulo || '',
    data: item?.data || '',
    hora: item?.hora || '',
    local: item?.local || '',
    cidade: item?.cidade || 'Boa Vista, RR',
    distancia_km: item?.distancia_km || '',
    preco: item?.preco || '',
    status: item?.status || 'rascunho',
    link_inscricao: item?.link_inscricao || '',
  })

  return (
    <Modal title={item ? 'EDITAR EVENTO' : 'NOVO EVENTO'} onClose={onClose}>
      <Field label="NOME"><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <Field label="SUBTÍTULO"><input value={form.subtitulo} onChange={e => setForm({ ...form, subtitulo: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="DATA"><input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
        <Field label="HORA"><input type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      </div>
      <Field label="LOCAL"><input value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="DISTÂNCIA (KM)"><input type="number" value={form.distancia_km} onChange={e => setForm({ ...form, distancia_km: Number(e.target.value) })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
        <Field label="PREÇO"><input value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      </div>
      <Field label="STATUS">
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'rascunho' | 'inscricoes_abertas' | 'encerrado' })}
          className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
        >
          <option value="rascunho">Rascunho</option>
          <option value="inscricoes_abertas">Inscrições Abertas</option>
          <option value="encerrado">Encerrado</option>
        </select>
      </Field>
      <Field label="LINK INSCRIÇÃO"><input value={form.link_inscricao} onChange={e => setForm({ ...form, link_inscricao: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <button onClick={() => onSave(form)} className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200">SALVAR</button>
    </Modal>
  )
}

// ─── Treino Modal ───
function TreinoModal({ item, onClose, onSave }: { item?: Treino; onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({
    dia_semana: item?.dia_semana || 'SEG',
    dia_completo: item?.dia_completo || '',
    hora: item?.hora || '',
    local: item?.local || '',
    endereco: item?.endereco || '',
    cidade: item?.cidade || 'Boa Vista, RR',
    nivel: item?.nivel || 'TODOS OS NÍVEIS',
    ativo: item?.ativo ?? true,
  })

  return (
    <Modal title={item ? 'EDITAR TREINO' : 'NOVO TREINO'} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="DIA (ABREV)">
          <select value={form.dia_semana} onChange={e => setForm({ ...form, dia_semana: e.target.value as 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM' })}
            className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
          >
            {['SEG','TER','QUA','QUI','SEX','SAB','DOM'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="DIA COMPLETO"><input value={form.dia_completo} onChange={e => setForm({ ...form, dia_completo: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      </div>
      <Field label="HORA"><input type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <Field label="LOCAL"><input value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <Field label="ENDEREÇO"><input value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <Field label="NÍVEL">
        <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}
          className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
        >
          {['TODOS OS NÍVEIS','INICIANTE','INTERMEDIARIO','AVANCADO','LONGAO','RECUPERACAO'].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </Field>
      <button onClick={() => onSave(form)} className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200">SALVAR</button>
    </Modal>
  )
}

// ─── Membro Modal ───
function MembroModal({ item, onClose, onSave }: { item?: Membro; onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({
    nome: item?.nome || '',
    email: item?.email || '',
    telefone: item?.telefone || '',
    categoria: item?.categoria || 'ATLETA',
    status: item?.status || 'Ativo',
    eventos_participados: item?.eventos_participados || 0,
  })

  return (
    <Modal title={item ? 'EDITAR MEMBRO' : 'NOVO MEMBRO'} onClose={onClose}>
      <Field label="NOME"><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <Field label="E-MAIL"><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <Field label="TELEFONE"><input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CATEGORIA">
          <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
            className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
          >
            {['ATLETA','PACERS','ORGANIZADOR','ADMIN'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="STATUS">
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Membro['status'] })}
            className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
          >
            {['Ativo','Inativo','Pendente'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <button onClick={() => onSave(form)} className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200">SALVAR</button>
    </Modal>
  )
}

// ─── Galeria Modal ───
function GaleriaModal({ eventos, onClose, onSave }: { eventos: Evento[]; onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({
    titulo: '',
    categoria: 'EVENTOS',
    evento_id: '',
    imagem_url: '',
    descricao: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSave() {
    if (!file && !form.imagem_url) return
    setUploading(true)
    try {
      let url = form.imagem_url
      if (file) {
        const path = `galeria/${Date.now()}_${file.name}`
        url = await uploadImage('galeria', file, path)
      }
      await onSave({ ...form, imagem_url: url })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal title="NOVA FOTO" onClose={onClose}>
      <Field label="TÍTULO"><input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CATEGORIA">
          <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
            className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
          >
            {['EVENTOS','TREINOS','ATLETAS'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="EVENTO (opcional)">
          <select value={form.evento_id} onChange={e => setForm({ ...form, evento_id: e.target.value })}
            className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime"
          >
            <option value="">Nenhum</option>
            {eventos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </Field>
      </div>
      <Field label="IMAGEM URL"><input value={form.imagem_url} onChange={e => setForm({ ...form, imagem_url: e.target.value })} placeholder="https://..." className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" /></Field>
      <p className="font-body text-xs text-muted text-center my-2">— OU —</p>
      <Field label="UPLOAD">
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime" />
      </Field>
      <button onClick={handleSave} disabled={uploading}
        className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200 disabled:opacity-50"
      >
        {uploading ? 'ENVIANDO...' : 'SALVAR'}
      </button>
    </Modal>
  )
}
