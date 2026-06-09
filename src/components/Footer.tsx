import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-2xl text-fg tracking-wider">
              DARK<span className="text-lime">Ø</span>
            </span>
            <span className="font-body text-[9px] font-semibold tracking-[0.35em] text-muted uppercase">
              RUN CLUB
            </span>
          </div>

          {/* Tagline */}
          <p className="font-display font-bold text-sm tracking-widest text-muted text-center">
            CORRIDA COM MÚSICA E <span className="text-lime">ENERGIA.</span>
          </p>

          {/* Social */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/darko.run"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-lime transition-colors duration-200 font-body text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @DARKORUNCLUB
            </a>
            <a
              href="https://tiktok.com/@darko.run"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-lime transition-colors duration-200 font-body text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
              </svg>
              @DARKORUNCLUB
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted font-body text-xs">
            © 2026 DARKØ RUN CLUB. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/admin" className="text-muted hover:text-lime font-body text-xs transition-colors duration-200">
              Área Admin
            </Link>
            <Link to="/membros" className="text-muted hover:text-lime font-body text-xs transition-colors duration-200">
              Área Membros
            </Link>
          </div>
          <p className="font-display font-black text-xs tracking-widest text-muted">
            #BORA CORRER JUNTO
          </p>
        </div>
      </div>
    </footer>
  )
}
