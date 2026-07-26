import { createClient } from '@supabase/supabase-js'

// Obtén estas variables de tu proyecto Supabase
// https://supabase.com/dashboard/project/{project-ref}/settings/api
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Variables de Supabase no configuradas. Usa localStorage temporalmente.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          name?: string
        }
      }
      measurements: {
        Row: {
          id: string
          user_id: string
          pecho: string
          cintura: string
          cadera: string
          hombros: string
          manga: string
          entrepierna: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          pecho: string
          cintura: string
          cadera: string
          hombros: string
          manga: string
          entrepierna: string
        }
        Update: {
          pecho?: string
          cintura?: string
          cadera?: string
          hombros?: string
          manga?: string
          entrepierna?: string
        }
      }
      garments: {
        Row: {
          id: string
          user_id: string
          name: string
          brand: string
          size: string
          type: string
          model?: string
          photo_url?: string
          ref_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          brand: string
          size: string
          type: string
          model?: string
          photo_url?: string
          ref_active?: boolean
        }
        Update: {
          name?: string
          brand?: string
          size?: string
          type?: string
          model?: string
          photo_url?: string
          ref_active?: boolean
        }
      }
    }
  }
}
