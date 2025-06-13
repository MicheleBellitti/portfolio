'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Loader2, Upload } from 'lucide-react'
import AnimatedText from '@/components/ui/AnimatedText'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchActiveResume()
  }, [])

  const fetchActiveResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) throw error
      if (data) {
        setResumeUrl(data.file_url)
      }
    } catch (error) {
      console.error('Error fetching resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Upload to Supabase Storage
      const fileName = `resume-${Date.now()}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      // Deactivate current resume
      await supabase
        .from('resumes')
        .update({ is_active: false })
        .eq('is_active', true)

      // Insert new resume
      const { error: insertError } = await supabase
        .from('resumes')
        .insert({
          file_url: publicUrl,
          file_name: file.name,
          is_active: true,
        })

      if (insertError) throw insertError

      setResumeUrl(publicUrl)
      toast.success('Resume updated successfully!')
    } catch (error) {
      toast.error('Failed to upload resume')
      console.error('Upload error:', error)
    }
  }

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
            <AnimatedText>My Resume</AnimatedText>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Download my latest CV or view it online
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin" />
                </div>
          ) : (
            <>
              {resumeUrl && (
                <div className="col-span-2 md:col-span-1">
                  <div className="relative h-0 pb-[150%]">
                    <iframe
                      src={resumeUrl}
                      className="w-full h-full"
                      title="Resume"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              <div className="col-span-2 md:col-span-1">
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold">Upload New Resume</h2>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileUpload(null)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Upload
                  </button>
                </div>
              )}
            <button/>
          )}
        </div>
      </div>
    </section>
  </div>
  )
}