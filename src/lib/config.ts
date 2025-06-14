// lib/config.ts
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'test@example.com',
}

export const isSupabaseConfigured = () => {
  return !!(
    config.supabase.url && 
    config.supabase.anonKey &&
    config.supabase.url !== 'https://placeholder.supabase.co'
  )
} 