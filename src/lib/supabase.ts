import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lgubloplgjhbmecgplpr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndWJsb3BsZ2poYm1lY2dwbHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODgwMTAsImV4cCI6MjA3NzU2NDAxMH0.aiWLfVdZMU08uF-UzHjD9LeZuj14JVcEx78btarqGfQ'

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