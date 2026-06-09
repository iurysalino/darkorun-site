import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'EVENTOS', href: '/eventos' },
  { label: 'TREINOS', href: '/treinos' },
  { label: 'MEMBROS', href: '/membros' },
  { label: 'GALERIA', href: '/galeria' },
  { label: 'SIMULADOS', href: '/simulados' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none group">
          <span className="font-display font-black text-2xl text-fg tracking-wider group-hover:text-lime transition-colors duration-200">
            DARK<span className="text-lime">Ø</span>
          </span>
          <span className="font-body text-[9px] font-semibold tracking-[0.35em] text-muted uppercase">
            RUN CLUB
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-display font-bold text-sm tracking-widest transition-colors duration-200 ${
                location.pathname === link.href
                  ? 'text-lime'
                  : 'text-fg hover:text-lime'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <Link
            to="/membros"
            className="hidden md:block bg-lime text-bg font-display font-black text-sm tracking-widest px-5 py-2.5 hover:bg-lime-dark transition-colors duration-200"
          >
            INSCREVA-SE
          </Link>
          <Link
            to="/admin"
            className="hidden md:block border border-border text-muted font-display font-bold text-xs tracking-widest px-3 py-2 hover:border-lime hover:text-lime transition-colors duration-200"
          >
            ADMIN
          </Link>
          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-fg transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-fg transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-fg transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-surface border-t border-border"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-display font-bold text-lg tracking-widest py-3 border-b border-border transition-colors duration-200 ${
                    location.pathname === link.href ? 'text-lime' : 'text-fg'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/membros"
                onClick={() => setOpen(false)}
                className="mt-4 bg-lime text-bg font-display font-black text-sm tracking-widest px-5 py-3 text-center"
              >
                INSCREVA-SE
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
