// components/sections/Skills.tsx
'use client'

import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/AnimatedText'
import SkillsCarousel from '@/components/ui/SkillsCarousel'

const skills = {
  languages: ['Python', 'Rust', 'C/C++', 'Java', 'TypeScript', 'SQL'],
  frameworks: ['PyTorch', 'Flask/Django', 'React', 'Next.js', 'Polars', 'scikit-learn'],
  tools: ['Docker', 'AWS/GCP', 'Snowflake', 'DBT', 'Git', 'CI/CD'],
  expertise: ['AI/ML Engineering', 'Data Engineering', 'Computer Vision', 'Backend Development']
}

export default function Skills() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <AnimatedText>Skills & Expertise</AnimatedText>
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <SkillsCarousel skills={skills} />
        </div>
      </div>
    </section>
  )
}
