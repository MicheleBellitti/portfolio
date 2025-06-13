// components/admin/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AnimatedText from '@/components/ui/AnimatedText'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/')
    } catch (error) {
      // Error is handled in useAuth hook
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="glass-effect rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <AnimatedText>Admin Login</AnimatedText>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to manage your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="loading-dots">
                <span className="inline-block w-2 h-2 bg-white rounded-full mx-1"></span>
                <span className="inline-block w-2 h-2 bg-white rounded-full mx-1"></span>
                <span className="inline-block w-2 h-2 bg-white rounded-full mx-1"></span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  )
}