import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const distances = [
  { label: '5KM', value: 5 },
  { label: '10KM', value: 10 },
  { label: '21KM', value: 21 },
  { label: '42KM', value: 42 },
]

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}min ${s.toString().padStart(2, '0')}s`
  return `${m}min ${s.toString().padStart(2, '0')}s`
}

function formatPace(secsPerKm: number) {
  const m = Math.floor(secsPerKm / 60)
  const s = Math.floor(secsPerKm % 60)
  return `${m}:${s.toString().padStart(2, '0')} /km`
}

export default function SimuladosPage() {
  const [distance, setDistance] = useState(10)
  const [customDist, setCustomDist] = useState('')
  const [paceMin, setPaceMin] = useState('6')
  const [paceSec, setPaceSec] = useState('00')
  const [result, setResult] = useState<{ time: number; pace: number } | null>(null)

  const effectiveDist = customDist ? parseFloat(customDist) : distance

  function calculate() {
    const paceSeconds = parseInt(paceMin) * 60 + parseInt(paceSec || '0')
    if (!effectiveDist || !paceSeconds) return
    const totalSeconds = paceSeconds * effectiveDist
    setResult({ time: totalSeconds, pace: paceSeconds })
  }

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
                SIMULADOS<br />DE CORRIDA
              </h1>
              <p className="font-body text-muted mt-4 max-w-lg">
                Calcule seu tempo estimado e pace para os próximos eventos. Prepare-se para chegar forte.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-surface border border-border p-6 md:p-8"
            >
              <h2 className="font-display font-black text-xl tracking-widest text-fg mb-6">CALCULADORA DE PACE</h2>

              {/* Distance selector */}
              <div className="mb-6">
                <label className="font-display font-bold text-xs tracking-widest text-lime uppercase block mb-3">
                  DISTÂNCIA
                </label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {distances.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => { setDistance(d.value); setCustomDist('') }}
                      className={`font-display font-black text-sm tracking-widest px-4 py-2.5 transition-colors duration-200 ${
                        distance === d.value && !customDist
                          ? 'bg-lime text-bg'
                          : 'border border-border text-muted hover:border-lime hover:text-lime'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Distância personalizada (km)"
                    value={customDist}
                    onChange={(e) => setCustomDist(e.target.value)}
                    className="flex-1 bg-bg border border-border text-fg font-body text-sm px-4 py-3 focus:outline-none focus:border-lime transition-colors duration-200 placeholder:text-muted"
                  />
                  <span className="font-display font-bold text-sm text-muted">KM</span>
                </div>
              </div>

              {/* Pace input */}
              <div className="mb-8">
                <label className="font-display font-bold text-xs tracking-widest text-lime uppercase block mb-3">
                  PACE ALVO (MIN/KM)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="3" max="15"
                      value={paceMin}
                      onChange={(e) => setPaceMin(e.target.value)}
                      className="w-20 bg-bg border border-border text-fg font-display font-black text-2xl text-center px-2 py-3 focus:outline-none focus:border-lime transition-colors duration-200"
                    />
                    <span className="font-display font-bold text-[10px] text-muted tracking-widest mt-1">MIN</span>
                  </div>
                  <span className="font-display font-black text-2xl text-muted">:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0" max="59"
                      value={paceSec}
                      onChange={(e) => setPaceSec(e.target.value.padStart(2, '0'))}
                      className="w-20 bg-bg border border-border text-fg font-display font-black text-2xl text-center px-2 py-3 focus:outline-none focus:border-lime transition-colors duration-200"
                    />
                    <span className="font-display font-bold text-[10px] text-muted tracking-widest mt-1">SEG</span>
                  </div>
                  <span className="font-display font-bold text-sm text-muted">/KM</span>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200"
              >
                CALCULAR TEMPO
              </button>
            </motion.div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-surface border border-border p-6 md:p-8 flex flex-col justify-center"
            >
              {result ? (
                <div>
                  <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-6">RESULTADO</p>
                  <div className="mb-6">
                    <p className="font-display font-bold text-sm text-muted tracking-widest mb-1">TEMPO ESTIMADO</p>
                    <p className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] text-fg leading-none">
                      {formatTime(result.time)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                    <div>
                      <p className="font-display font-bold text-xs text-muted tracking-widest mb-1">PACE</p>
                      <p className="font-display font-black text-xl text-lime">{formatPace(result.pace)}</p>
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs text-muted tracking-widest mb-1">DISTÂNCIA</p>
                      <p className="font-display font-black text-xl text-fg">{effectiveDist} KM</p>
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs text-muted tracking-widest mb-1">VELOCIDADE MÉDIA</p>
                      <p className="font-display font-black text-xl text-fg">
                        {(3600 / result.pace).toFixed(1)} km/h
                      </p>
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs text-muted tracking-widest mb-1">PASSOS/MIN (EST.)</p>
                      <p className="font-display font-black text-xl text-fg">~170 spm</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-border mx-auto mb-4" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <p className="font-display font-bold text-muted text-sm tracking-widest">
                    PREENCHA OS DADOS E CALCULE SEU TEMPO
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { label: 'PACE INICIANTE', value: '7:00 – 8:30 /km', desc: 'Confortável, consegue conversar' },
              { label: 'PACE INTERMEDIÁRIO', value: '5:30 – 7:00 /km', desc: 'Esforço moderado, respiração controlada' },
              { label: 'PACE AVANÇADO', value: '4:00 – 5:30 /km', desc: 'Alta intensidade, foco total' },
            ].map((tip) => (
              <div key={tip.label} className="bg-surface border border-border p-5">
                <p className="font-display font-bold text-[10px] tracking-widest text-lime uppercase mb-1">{tip.label}</p>
                <p className="font-display font-black text-xl text-fg">{tip.value}</p>
                <p className="font-body text-xs text-muted mt-1">{tip.desc}</p>
              </div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
