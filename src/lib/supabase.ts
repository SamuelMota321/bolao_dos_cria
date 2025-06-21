import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Profile {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Bolao {
  id: string
  name: string
  password: string
  campeonato: string
  creator_id: string
  created_at: string
  updated_at: string
  creator?: Profile
  participants_count?: number
}

export interface BolaoParticipant {
  id: string
  bolao_id: string
  user_id: string
  joined_at: string
  user?: Profile
  bolao?: Bolao
}