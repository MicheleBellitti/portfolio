// app/(public)/projects/page.tsx
import { Metadata } from 'next'
import ProjectsGrid from '@/components/sections/ProjectsGrid'

export const metadata: Metadata = {
  title: 'Projects - Michele Bellitti',
  description: 'Explore my portfolio of AI, ML, and software development projects',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-20">
      <ProjectsGrid />
    </div>
  )
}