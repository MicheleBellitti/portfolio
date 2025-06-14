// components/sections/Contact.tsx
'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, Github, Linkedin } from 'lucide-react'
import AnimatedText from '@/components/ui/AnimatedText'

export default function Contact() {
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
            <AnimatedText>Get In Touch</AnimatedText>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-effect rounded-2xl p-8 space-y-6">
            <a
              href="mailto:michelebellitti272@gmail.com"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              <Mail className="w-6 h-6 text-primary-500" />
              <span className="text-lg">michelebellitti272@gmail.com</span>
            </a>

            

            <div className="flex justify-center gap-6 pt-6 border-t border-gray-200 dark:border-dark-border">
              <a
                href="https://github.com/michelebellitti"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/michelebellitti"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}