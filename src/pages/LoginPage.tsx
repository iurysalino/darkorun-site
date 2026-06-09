import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LoginPage() {
  return (
    <div className="bg-bg text-fg min-h-screen">
      <Navbar />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm mx-4 text-center">
          <p className="font-display font-bold text-xs tracking-[0.3em] text-lime uppercase mb-4">DARKØ RUN CLUB</p>
          <h1 className="font-display font-black text-3xl text-fg uppercase mb-8">ACESSO</h1>
          <div className="flex flex-col gap-4">
            <Link
              to="/membros"
              className="bg-lime text-bg font-display font-black text-sm tracking-widest py-4 hover:bg-lime-dark transition-colors duration-200 block"
            >
              ÁREA DE MEMBROS
            </Link>
            <Link
              to="/admin"
              className="border border-border text-muted font-display font-bold text-sm tracking-widest py-4 hover:border-lime hover:text-lime transition-colors duration-200 block"
            >
              ÁREA ADMINISTRATIVA
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
