import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ckccarkzdxvkhuweojbs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2Nhcmt6ZHh2a2h1d2VvamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzE5MzcsImV4cCI6MjEwNzIwNzkzN30.IGKCQEC9OFRXKjA30Rg8pE7R_Qxj9UXZKt_9ts4pdxw'

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