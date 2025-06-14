// components/sections/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/AnimatedText'
import { ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ParticleBackground = dynamic(
  () => import('@/components/three/ParticleBackground'),
  { ssr: false }
)

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <AnimatedText>Hi, I'm Michele</AnimatedText>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gradient font-semibold mb-6"
          >
            AI Engineer & Developer
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Specializing in Agentic AI, Computer Vision, ML/Data Engineering, and creating
          intelligent solutions with Python and Rust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/projects"
            className="px-8 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
          >
            View My Work
          </Link>
          <Link
            href="/resume"
            className="px-8 py-3 rounded-lg glass-effect font-medium hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            Download Resume
          </Link>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          onClick={scrollToAbout}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-primary-500" />
        </motion.button>
      </div>
    </section>
  )
}
