import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PropertyListing = {
  id: string
  title: string
  description: string
  price: string
  area: string
  location: string
  property_type: 'residential' | 'commercial'
  contact_name: string
  contact_phone: string
  contact_email: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  user_id: string
  created_at: string
  updated_at: string
}