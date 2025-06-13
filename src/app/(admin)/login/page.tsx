// app/(admin)/login/page.tsx
import { Metadata } from 'next'
import LoginForm from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Admin Login - Michele Bellitti',
  description: 'Admin login page',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <LoginForm />
    </div>
  )
}