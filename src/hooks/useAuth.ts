'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Check if Supabase is properly configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: Check localStorage for demo user
      const demoUser = localStorage.getItem('demo-user')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
      }
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            isAdmin: authUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
          })
        }
      } catch (error) {
        console.log('Auth check error (this is normal if Supabase is not set up):', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          isAdmin: session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [isSupabaseConfigured, router])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode login
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || email === 'test@example.com') {
        const demoUser: User = {
          id: 'demo-user-id',
          email: email,
          isAdmin: true
        }
        setUser(demoUser)
        localStorage.setItem('demo-user', JSON.stringify(demoUser))
        toast.success('Successfully logged in (Demo Mode)!')
        router.push('/')
        router.refresh()
        return
      } else {
        toast.error('Invalid credentials for demo mode')
        throw new Error('Invalid credentials')
      }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Successfully logged in!')
      router.push('/')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      // Demo mode logout
      setUser(null)
      localStorage.removeItem('demo-user')
      toast.success('Successfully logged out (Demo Mode)!')
      router.push('/')
      router.refresh()
      return
    }

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Successfully logged out!')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return { user, loading, signIn, signOut }
}