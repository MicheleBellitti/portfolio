// components/sections/About.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import AnimatedText from '@/components/ui/AnimatedText'

export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-dark-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <AnimatedText>About Me</AnimatedText>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl rotate-6"></div>
              <div className="relative glass-effect rounded-2xl p-8 h-full flex items-center justify-center">
                <div className="text-6xl font-bold text-gradient">MB</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300">
              I'm a graduate student in Computer Engineering at the University of
              Modena and Reggio Emilia, currently pursuing my Master's degree with
              a focus on Large Scale Artificial Intelligence Engineering.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              As an AI Engineer with a passion for creating intelligent systems,
              I specialize in Computer Vision, Data Engineering, and developing
              scalable solutions using modern technologies like Python, Rust, and
              cloud platforms.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Currently working as a Machine Learning Engineer at Prometeia, in the Data Science division, where
              I'm designing and implementing optimized and scalable AI-based solutions for the financial sector.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}