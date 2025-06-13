// components/ui/SkillsCarousel.tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface SkillsCarouselProps {
  skills: {
    languages: string[]
    frameworks: string[]
    tools: string[]
    expertise: string[]
  }
}

export default function SkillsCarousel({ skills }: SkillsCarouselProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof skills>('languages')

  const categories = [
    { key: 'languages', label: 'Languages', icon: '💻' },
    { key: 'frameworks', label: 'Frameworks', icon: '🛠️' },
    { key: 'tools', label: 'Tools', icon: '🔧' },
    { key: 'expertise', label: 'Expertise', icon: '🎯' },
  ] as const

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.key)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeCategory === category.key
                ? 'bg-primary-500 text-white shadow-lg glow-effect'
                : 'glass-effect hover:bg-white/20 dark:hover:bg-white/10'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {skills[activeCategory].map((skill, index) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-effect rounded-lg p-4 text-center hover:shadow-lg transition-all"
          >
            <span className="text-lg font-medium">{skill}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}