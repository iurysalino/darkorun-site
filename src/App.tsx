import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import EventsPage from '@/pages/EventsPage'
import TrainingPage from '@/pages/TrainingPage'
import GalleryPage from '@/pages/GalleryPage'
import SimuladosPage from '@/pages/SimuladosPage'
import MembersPage from '@/pages/MembersPage'
import AdminPage from '@/pages/AdminPage'
import LoginPage from '@/pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/treinos" element={<TrainingPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/simulados" element={<SimuladosPage />} />
        <Route path="/membros" element={<MembersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
