import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getEventos, type Evento } from '@/lib/supabase'

const statusLabel: Record<string, { label: string; color: string }> = {
  'inscricoes_abertas': { label: 'INSCRIÇÕES ABERTAS', color: 'bg-lime text-bg' },
  'rascunho': { label: 'EM BREVE', color: 'bg-surface-2 text-muted border border-border' },
  'encerrado': { label: 'ENCERRADO', color: 'bg-surface-2 text-muted border border-border' },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate().toString().padStart(2, '0')
  const month = d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()
  const year = d.getFullYear()
  return { day, month, year }
}

function formatTime(timeStr?: string) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  return `${h}H${m}`
}

export default function EventsPage() {
  const [events, setEvents] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getEventos()
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-bg text-fg min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="border-b border-border bg-surface">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-3">DARKØ RUN CLUB</p>
              <h1 className="font-display font-black text-[clamp(3rem,8vw,6rem)] uppercase leading-none text-fg">
                PRÓXIMOS<br />EVENTOS
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Events list */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          {loading && (
            <div className="text-center py-16">
              <p className="font-display font-bold text-muted text-sm tracking-widest">CARREGANDO EVENTOS...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 border border-red-400/30 bg-red-400/10">
              <p className="font-body text-red-400 text-sm">Erro: {error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {events.map((ev, i) => {
              const { day, month, year } = formatDate(ev.data)
              const distancia = ev.distancia_km ? `${ev.distancia_km}KM` : ''
              const status = ev.status
              const isEncerrado = status === 'encerrado'

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface border border-border hover:border-lime transition-colors duration-300 group"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Date */}
                    <div className="text-center md:text-left min-w-[80px]">
                      <p className="font-display font-black text-[3rem] leading-none text-lime">{day}</p>
                      <p className="font-display font-bold text-sm tracking-widest text-muted">{month} {year}</p>
                    </div>

                    <div className="w-px h-16 bg-border hidden md:block" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`font-display font-black text-[10px] tracking-widest px-2.5 py-1 ${statusLabel[status].color}`}>
                          {statusLabel[status].label}
                        </span>
                        {distancia && (
                          <span className="font-display font-bold text-xs tracking-widest text-lime border border-lime px-2 py-0.5">
                            {distancia}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display font-black text-xl md:text-2xl text-fg tracking-wide group-hover:text-lime transition-colors duration-200">
                        {ev.nome}
                      </h2>
                      <p className="font-display font-bold text-xs tracking-widest text-muted mt-1">{ev.subtitulo}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="flex items-center gap-1.5 font-body text-sm text-muted">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {ev.local} • {ev.cidade}
                        </span>
                        {ev.hora && (
                          <span className="flex items-center gap-1.5 font-body text-sm text-muted">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {formatTime(ev.hora)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      <p className="font-display font-black text-2xl text-fg">{ev.preco || '—'}</p>
                      {status === 'inscricoes_abertas' && ev.link_inscricao ? (
                        <a
                          href={ev.link_inscricao}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-lime text-bg font-display font-black text-xs tracking-widest px-6 py-3 hover:bg-lime-dark transition-colors duration-200 inline-block"
                        >
                          INSCREVA-SE E GARANTA SUA VAGA
                        </a>
                      ) : isEncerrado ? (
                        <Link
                          to={`/galeria?evento=${ev.id}`}
                          className="border border-lime text-lime font-display font-bold text-xs tracking-widest px-6 py-3 hover:bg-lime hover:text-bg transition-colors duration-200 inline-block"
                        >
                          VEJA COMO FOI →
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="border border-border text-muted font-display font-bold text-xs tracking-widest px-6 py-3 cursor-not-allowed"
                        >
                          EM BREVE
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
