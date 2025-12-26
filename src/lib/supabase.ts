import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdwhvextsqtszyftvihb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkd2h2ZXh0c3F0c3p5ZnR2aWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0Njc3NjAsImV4cCI6MjA3NDA0Mzc2MH0.5xTzma5WlgLgtXBOwwfj1v4-qDVGrsWeSZhjcEkJkc4'

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