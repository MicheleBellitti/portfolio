// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/ui/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Michele Bellitti - AI Engineer & Developer',
  description: 'Portfolio of Michele Bellitti, AI Engineer specializing in Computer Vision, Data Engineering, and Full-Stack Development',
  keywords: ['AI Engineer', 'Python', 'Rust', 'Computer Vision', 'Data Engineering'],
  authors: [{ name: 'Michele Bellitti' }],
  openGraph: {
    title: 'Michele Bellitti - AI Engineer',
    description: 'Explore my projects and expertise in AI, ML, and Software Development',
    type: 'website',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}