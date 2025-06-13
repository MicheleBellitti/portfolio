'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import AnimatedText from '@/components/ui/AnimatedText'
import ProjectCard from '@/components/ui/ProjectCard'
import { projects } from '@/lib/projects'

export default function ProjectsGrid() {
  const [filter, setFilter] = useState<string>('all')
  
  const allTechs = Array.from(
    new Set(projects.flatMap(p => p.techStack))
  ).sort()

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.techStack.includes(filter))

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <AnimatedText>My Projects</AnimatedText>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A collection of my work and experiments
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'glass-effect hover:bg-white/20 dark:hover:bg-white/10'
            }`}
          >
            All
          </button>
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === tech
                  ? 'bg-primary-500 text-white'
                  : 'glass-effect hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              {tech}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}