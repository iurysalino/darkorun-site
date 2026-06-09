import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getEventos, getTreinos, type Evento, type Treino } from '@/lib/supabase'

function SectionReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEventos(), getTreinos()])
      .then(([ev, tr]) => {
        setEventos(ev.slice(0, 3))
        setTreinos(tr)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function formatEventDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00')
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
    }
  }

  function formatEventTime(timeStr?: string) {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    return `${h}H${m}`
  }

  function formatTreinoTime(timeStr: string) {
    const [h, m] = timeStr.split(':')
    return `${h}H${m}`
  }

  const proximoEvento = eventos[0]

  return (
    <div className="bg-bg text-fg min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[78vh] lg:min-h-[82vh] flex flex-col justify-end overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt="Corredor DarkoRun"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 pb-12 md:pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display font-black uppercase leading-[0.88] text-[clamp(3.5rem,10vw,9rem)] text-fg">
              CORRIDA<br />
              COM MÚSICA<br />
              <span className="text-lime">E ENERGIA</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex items-center gap-3"
          >
            <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden="true">
              {[2,5,8,11,14,17,20,23,26].map((x, i) => (
                <rect key={i} x={x} y={i % 2 === 0 ? 4 : 0} width="1.5" height={i % 2 === 0 ? 8 : 16} fill="#C8FF00" rx="1"/>
              ))}
            </svg>
            <p className="font-display font-bold text-lg md:text-xl tracking-widest text-fg uppercase">
              RITMO QUE TE <span className="text-lime">MOVE.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/membros"
              className="bg-lime text-bg font-display font-black text-sm tracking-widest px-8 py-4 hover:bg-lime-dark transition-colors duration-200 inline-block"
            >
              INSCREVA-SE
            </Link>
            <Link
              to="/eventos"
              className="border border-lime text-lime font-display font-bold text-sm tracking-widest px-8 py-4 hover:bg-lime hover:text-bg transition-colors duration-200 inline-block"
            >
              VER EVENTOS
            </Link>
          </motion.div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col items-center gap-2">
          <span className="font-display font-black text-xs tracking-[0.4em] text-muted uppercase [writing-mode:vertical-rl] rotate-180">
            BORA CORRER JUNTO.
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#C8FF00" strokeWidth="1.5"/>
            <circle cx="8" cy="8" r="2" fill="#C8FF00"/>
          </svg>
        </div>
      </section>

      {/* ── PRÓXIMA CORRIDA + EVENTOS + MEMBROS ── */}
      <section className="bg-bg border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">

            {/* Próxima corrida */}
            <SectionReveal className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display font-black text-xs tracking-[0.3em] text-lime uppercase [writing-mode:vertical-rl] rotate-180 hidden md:block">
                  PRÓXIMA CORRIDA
                </span>
                <span className="font-display font-black text-xs tracking-[0.3em] text-lime uppercase md:hidden">
                  PRÓXIMA CORRIDA
                </span>
              </div>
              <div className="bg-surface border border-border p-5">
                {proximoEvento ? (
                  <>
                    <p className="font-display font-black text-lime text-sm tracking-widest mb-1">{proximoEvento.nome}</p>
                    <p className="font-display font-black text-[clamp(2.5rem,6vw,4rem)] leading-none text-fg">
                      {new Date(proximoEvento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      {proximoEvento.hora && (
                        <div className="flex items-center gap-2 text-muted font-body text-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {formatEventTime(proximoEvento.hora)}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted font-body text-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {proximoEvento.local} • {proximoEvento.cidade}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="font-body text-muted text-sm">Nenhum evento programado.</p>
                )}
                <Link
                  to="/eventos"
                  className="mt-5 inline-flex items-center gap-2 border border-lime text-lime font-display font-bold text-xs tracking-widest px-4 py-2.5 hover:bg-lime hover:text-bg transition-colors duration-200"
                >
                  SAIBA MAIS
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </SectionReveal>

            {/* Eventos */}
            <SectionReveal className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display font-black text-xs tracking-[0.3em] text-lime uppercase">EVENTOS</p>
                <div className="h-px flex-1 bg-border mx-4" />
              </div>
              <div className="flex flex-col divide-y divide-border">
                {eventos.slice(0, 3).map((ev) => {
                  const { day, month } = formatEventDate(ev.data)
                  return (
                    <Link
                      key={ev.id}
                      to="/eventos"
                      className="flex items-center gap-4 py-4 group hover:bg-surface/50 -mx-2 px-2 transition-colors duration-200"
                    >
                      <div className="text-center min-w-[40px]">
                        <p className="font-display font-black text-2xl text-lime leading-none">{day}</p>
                        <p className="font-display font-bold text-xs text-muted tracking-widest">{month}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-fg tracking-wide truncate group-hover:text-lime transition-colors duration-200">{ev.nome}</p>
                        <p className="font-body text-xs text-muted mt-0.5">{ev.local}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted group-hover:text-lime transition-colors duration-200 shrink-0" aria-hidden="true">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </Link>
                  )
                })}
              </div>
              <Link
                to="/eventos"
                className="mt-4 inline-flex items-center gap-2 border border-border text-muted font-display font-bold text-xs tracking-widest px-4 py-2.5 hover:border-lime hover:text-lime transition-colors duration-200 w-full justify-center"
              >
                VER TODOS OS EVENTOS
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </SectionReveal>

            {/* Membros */}
            <SectionReveal className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display font-black text-xs tracking-[0.3em] text-lime uppercase">MEMBROS</p>
                <div className="h-px flex-1 bg-border mx-4" />
              </div>
              <div className="bg-surface border border-border p-5">
                <p className="font-display font-black text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-fg">1.248</p>
                <p className="font-display font-bold text-sm tracking-widest text-muted mt-1">MEMBROS ATIVOS</p>
                <p className="font-body text-sm text-muted mt-4 leading-relaxed">
                  Faça parte da comunidade que corre com propósito.
                </p>
                <Link
                  to="/membros"
                  className="mt-5 inline-flex items-center gap-2 border border-lime text-lime font-display font-bold text-xs tracking-widest px-4 py-2.5 hover:bg-lime hover:text-bg transition-colors duration-200"
                >
                  SEJA UM MEMBRO
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── TREINOS DA SEMANA ── */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <SectionReveal>
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="shrink-0">
                <h2 className="font-display font-black text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-tight text-fg">
                  TREINOS<br />DA SEMANA
                </h2>
                <div className="w-12 h-1 bg-lime mt-3" />
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {treinos.map((t) => (
                  <Link
                    key={t.id}
                    to="/treinos"
                    className="bg-bg border border-border p-3 hover:border-lime group transition-colors duration-200"
                  >
                    <p className="font-display font-black text-lime text-lg tracking-widest">{t.dia_semana}</p>
                    <p className="font-display font-bold text-xs text-fg mt-1">{formatTreinoTime(t.hora)}</p>
                    <p className="font-body text-xs text-muted mt-1 leading-tight">{t.local}</p>
                    <p className="font-body text-[10px] text-muted/60 mt-0.5">{t.cidade}</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted group-hover:text-lime transition-colors duration-200 mt-2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
              <div className="shrink-0 hidden lg:block text-right">
                <p className="font-display font-black text-sm tracking-widest text-fg uppercase">TREINO É HÁBITO.</p>
                <p className="font-display font-black text-sm tracking-widest text-lime uppercase">HÁBITO É LIBERDADE.</p>
                <p className="font-body text-xs text-muted mt-2">Apareça. Supere. Repita.</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── SIMULADOS CTA ── */}
      <section className="bg-bg border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
          <SectionReveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border border-border p-8 md:p-12">
              <div>
                <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-2">SIMULADOS DE CORRIDA</p>
                <h2 className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] uppercase leading-tight text-fg">
                  TESTE SEU<br />RITMO ANTES<br />DA CORRIDA
                </h2>
              </div>
              <div className="flex flex-col gap-4 items-start md:items-end">
                <p className="font-body text-muted text-sm max-w-xs md:text-right leading-relaxed">
                  Simule percursos, calcule seu pace e prepare-se para os próximos eventos do clube.
                </p>
                <Link
                  to="/simulados"
                  className="bg-lime text-bg font-display font-black text-sm tracking-widest px-8 py-4 hover:bg-lime-dark transition-colors duration-200 inline-block"
                >
                  ACESSAR SIMULADOS
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
