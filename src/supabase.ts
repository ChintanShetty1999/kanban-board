import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sign in as guest automatically
export async function signInAsGuest() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    await supabase.auth.signInAnonymously()
  }
}