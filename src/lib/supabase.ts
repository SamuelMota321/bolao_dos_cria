import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: any

// Check if environment variables are missing or contain placeholder values
const isValidUrl = supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')

const isValidKey = supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_PROJECT_ANON_KEY' &&
  supabaseAnonKey.length > 20

if (!isValidUrl || !isValidKey) {
  console.error('Missing or invalid Supabase environment variables. Please click "Connect to Supabase" button in the top right corner to set up your Supabase project.')
  
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
  
  // Assign the mock client to prevent crashes
  supabase = mockClient
} else {
  // Only create the real client if environment variables are valid
  supabase = createClient(supabaseUrl, supabaseAnonKey)
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

export interface Match {
  id: string
  bolao_id: string
  team_home: string
  team_away: string
  match_date: string
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'live' | 'finished'
  created_at: string
  updated_at: string
}

export interface Prediction {
  id: string
  match_id: string
  user_id: string
  predicted_home_score: number
  predicted_away_score: number
  points: number
  created_at: string
  updated_at: string
  user?: Profile
  match?: Match
}

export { supabase }