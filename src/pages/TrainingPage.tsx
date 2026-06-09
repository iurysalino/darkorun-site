import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getTreinos, type Treino } from '@/lib/supabase'

function formatHora(timeStr: string) {
  const [h, m] = timeStr.split(':')
  return `${h}H${m}`
}

export default function TrainingPage() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTreinos()
      .then(setTreinos)
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
                DATAS E LOCAIS<br />DE TREINO
              </h1>
              <p className="font-body text-muted mt-4 max-w-lg">
                Treinos abertos para todos os níveis. Apareça, corra junto, evolua.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Schedule grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          {loading && (
            <div className="text-center py-16">
              <p className="font-display font-bold text-muted text-sm tracking-widest">CARREGANDO TREINOS...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 border border-red-400/30 bg-red-400/10">
              <p className="font-body text-red-400 text-sm">Erro: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {treinos.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="bg-surface border border-border hover:border-lime transition-colors duration-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-display font-black text-3xl text-lime tracking-widest">{item.dia_semana}</p>
                    <p className="font-display font-bold text-xs text-muted tracking-widest mt-0.5">{item.dia_completo}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="font-display font-black text-xl text-fg">{formatHora(item.hora)}</p>
                  <p className="font-display font-bold text-sm text-fg mt-2">{item.local}</p>
                  <p className="font-body text-xs text-muted mt-1 leading-relaxed">{item.endereco || item.cidade}</p>
                  <span className="inline-block mt-3 font-display font-bold text-[10px] tracking-widest text-lime border border-lime/40 px-2 py-0.5">
                    {item.nivel}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 border border-lime/30 bg-lime/5 p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div>
                <p className="font-display font-black text-lime text-sm tracking-widest mb-2">TREINO É HÁBITO. HÁBITO É LIBERDADE.</p>
                <p className="font-body text-muted text-sm leading-relaxed max-w-xl">
                  Os treinos são abertos para membros e não-membros. Traga tênis, água e disposição.
                  Nossos pacers vão te guiar no ritmo certo para o seu nível.
                </p>
              </div>
              <div className="shrink-0">
                <p className="font-display font-black text-xs tracking-widest text-muted mb-1">DÚVIDAS?</p>
                <a
                  href="https://instagram.com/darko.run"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-bold text-sm text-lime hover:underline tracking-widest"
                >
                  @DARKO.RUN
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
