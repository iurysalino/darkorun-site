import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getGaleria, type GaleriaItem } from '@/lib/supabase'

const categories = ['TODOS', 'EVENTOS', 'TREINOS', 'ATLETAS']

export default function GalleryPage() {
  const [searchParams] = useSearchParams()
  const eventoFilter = searchParams.get('evento')

  const [active, setActive] = useState('TODOS')
  const [items, setItems] = useState<GaleriaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const cat = active === 'TODOS' ? undefined : active
    getGaleria(cat, eventoFilter || undefined)
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [active, eventoFilter])

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
                FOTOS DE<br />ATLETAS E EVENTOS
              </h1>
              {eventoFilter && (
                <p className="font-display font-bold text-sm text-lime tracking-widest mt-4">
                  FILTRADO POR EVENTO
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-display font-black text-xs tracking-widest px-5 py-2.5 transition-colors duration-200 ${
                  active === cat
                    ? 'bg-lime text-bg'
                    : 'border border-border text-muted hover:border-lime hover:text-lime'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          {loading && (
            <div className="text-center py-16">
              <p className="font-display font-bold text-muted text-sm tracking-widest">CARREGANDO GALERIA...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 border border-red-400/30 bg-red-400/10">
              <p className="font-body text-red-400 text-sm">Erro: {error}</p>
            </div>
          )}

          <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden bg-surface border border-border hover:border-lime transition-colors duration-300"
                  onClick={() => setLightbox(item.imagem_url)}
                >
                  {item.imagem_url ? (
                    <img
                      src={item.imagem_url}
                      alt={item.titulo}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-surface-2 flex items-center justify-center">
                      <div className="text-center p-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border mx-auto mb-2" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <p className="font-display font-bold text-xs text-muted tracking-widest">{item.categoria}</p>
                      </div>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="font-display font-black text-sm text-fg">{item.titulo}</p>
                      <p className="font-body text-xs text-muted">{item.data_foto || item.categoria}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {!loading && items.length === 0 && (
            <div className="text-center py-24">
              <p className="font-display font-bold text-muted text-lg tracking-widest">NENHUMA FOTO NESTA CATEGORIA</p>
            </div>
          )}
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-muted hover:text-lime transition-colors duration-200"
              aria-label="Fechar"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <img
              src={lightbox}
              alt="Foto ampliada"
              className="max-w-full max-h-[85vh] object-contain border border-border"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
