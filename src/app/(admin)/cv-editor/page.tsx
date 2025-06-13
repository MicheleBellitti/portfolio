// app/(admin)/cv-editor/page.tsx
import { Metadata } from 'next'
import CVEditor from '@/components/admin/CVEditor'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'CV Editor - Michele Bellitti',
  description: 'Edit and design your CV',
}

export default async function CVEditorPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen pt-20">
      <CVEditor />
    </div>
  )
}
