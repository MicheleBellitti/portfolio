// app/(public)/resume/page.tsx
import { Metadata } from 'next'
import ResumePage from '@/components/sections/ResumePage'

export const metadata: Metadata = {
  title: 'Resume - Michele Bellitti',
  description: 'View and download my professional resume',
}

export default function Resume() {
  return (
    <div className="min-h-screen pt-20">
      <ResumePage />
    </div>
  )
}