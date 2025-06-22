import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please click "Connect to Supabase" button in the top right corner to set up your Supabase project.')
  
  // Create a mock client to prevent the app from crashing
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured'))
    },
    from: () => ({
      select: () => Promise.reject(new Error('Supabase not configured')),
      insert: () => Promise.reject(new Error('Supabase not configured')),
      update: () => Promise.reject(new Error('Supabase not configured')),
      delete: () => Promise.reject(new Error('Supabase not configured'))
    })
  }
  
  // Export the mock client to prevent crashes
  export const supabase = mockClient as any
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}

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