// components/sections/FeaturedProjects.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedText from '@/components/ui/AnimatedText'
import ProjectCard from '@/components/ui/ProjectCard'
import { projects } from '@/lib/projects'

export default function FeaturedProjects() {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3)

  return (
    <section className="py-20 bg-white dark:bg-dark-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <AnimatedText>Featured Projects</AnimatedText>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Some of my recent work and experiments
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  )
}