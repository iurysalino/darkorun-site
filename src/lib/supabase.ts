import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://brofcafssdklwgsqrxpm.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyb2ZjYWZzc2RrbHdnc3FyeHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDQ0NjEsImV4cCI6MjA5NjUyMDQ2MX0.oIkQprsFYgx0Z1H0F302XvrOp7xICUs88a0cHIzh_5o'
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/admin-proxy`

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================
// Admin proxy — usa Edge Function para escrita
// ============================================
async function adminProxy(table: string, operation: string, payload: Record<string, unknown>) {
  // Edge Function expects: { table, operation, data, id }
  const { id, ...data } = payload
  const body: Record<string, unknown> = { table, operation }
  if (operation === 'insert') {
    body.data = payload
  } else if (operation === 'update') {
    body.id = id
    body.data = data
  } else if (operation === 'delete') {
    body.id = id
  }

  const res = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Admin proxy error: ${err}`)
  }
  return res.json()
}

// ============================================
// Types
// ============================================
export interface Evento {
  id: string
  nome: string
  subtitulo?: string
  data: string
  hora?: string
  local: string
  cidade: string
  distancia_km?: number
  preco?: string
  status: 'rascunho' | 'inscricoes_abertas' | 'encerrado'
  imagem_url?: string
  descricao?: string
  link_inscricao?: string
  created_at: string
}

export interface Treino {
  id: string
  dia_semana: 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM'
  dia_completo?: string
  hora: string
  local: string
  cidade?: string
  endereco?: string
  nivel: string
  ativo: boolean
  created_at: string
}

export interface GaleriaItem {
  id: string
  titulo: string
  categoria: 'EVENTOS' | 'TREINOS' | 'ATLETAS'
  imagem_url: string
  evento_id?: string
  data_foto?: string
  created_at: string
}

export interface Membro {
  id: string
  nome: string
  email: string
  telefone?: string
  numero_membro: string
  categoria?: string
  status: 'ativo' | 'inativo' | 'Ativo' | 'Inativo' | 'Pendente'
  eventos_participados?: number
  data_entrada: string
  created_at: string
}

// ============================================
// READ (anon key — leitura pública)
// ============================================
export async function getEventos() {
  const { data, error } = await supabase.from('eventos').select('*').order('data')
  if (error) throw error
  return data as Evento[]
}

export async function getTreinos() {
  const { data, error } = await supabase.from('treinos').select('*').order('dia_semana')
  if (error) throw error
  return data as Treino[]
}

export async function getGaleria(categoria?: string, eventoId?: string) {
  let query = supabase.from('galeria').select('*').order('created_at', { ascending: false })
  if (categoria) query = query.eq('categoria', categoria)
  if (eventoId) query = query.eq('evento_id', eventoId)
  const { data, error } = await query
  if (error) throw error
  return data as GaleriaItem[]
}

export async function getMembros() {
  const { data, error } = await supabase.from('membros').select('*').order('nome')
  if (error) throw error
  return data as Membro[]
}

// ============================================
// WRITE (Edge Function proxy — service_role)
// ============================================

// --- Eventos ---
export async function createEvento(evento: Omit<Evento, 'id' | 'created_at'>) {
  return adminProxy('eventos', 'insert', evento as unknown as Record<string, unknown>)
}

export async function updateEvento(id: string, evento: Partial<Evento>) {
  return adminProxy('eventos', 'update', { id, ...evento })
}

export async function deleteEvento(id: string) {
  return adminProxy('eventos', 'delete', { id })
}

// --- Treinos ---
export async function createTreino(treino: Omit<Treino, 'id' | 'created_at'>) {
  return adminProxy('treinos', 'insert', treino as unknown as Record<string, unknown>)
}

export async function updateTreino(id: string, treino: Partial<Treino>) {
  return adminProxy('treinos', 'update', { id, ...treino })
}

export async function deleteTreino(id: string) {
  return adminProxy('treinos', 'delete', { id })
}

// --- Galeria ---
export async function createGaleriaItem(item: Omit<GaleriaItem, 'id' | 'created_at'>) {
  return adminProxy('galeria', 'insert', item as unknown as Record<string, unknown>)
}

export async function deleteGaleriaItem(id: string) {
  return adminProxy('galeria', 'delete', { id })
}

// --- Membros ---
export async function createMembro(membro: Omit<Membro, 'id' | 'created_at'>) {
  return adminProxy('membros', 'insert', membro as unknown as Record<string, unknown>)
}

export async function updateMembro(id: string, membro: Partial<Membro>) {
  return adminProxy('membros', 'update', { id, ...membro })
}

export async function deleteMembro(id: string) {
  return adminProxy('membros', 'delete', { id })
}

// --- Upload de imagem ---
export async function uploadImage(bucket: string = 'galeria', file?: File, path?: string) {
  const f = file || (bucket as unknown as File)
  const b = file ? bucket : 'galeria'
  const ext = f.name.split('.').pop()
  const filename = path || `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from(b).upload(filename, f)
  if (error) throw error
  const { data: urlData } = supabase.storage.from(b).getPublicUrl(data.path)
  return urlData.publicUrl
}
