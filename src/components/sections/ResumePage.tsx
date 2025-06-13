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

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              {resumeUrl ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Download Button */}
                  <div className="flex justify-center">
                    <a
                      href={resumeUrl}
                      download
                      className="bg-primary-500 text-white px-8 py-3 rounded-lg inline-flex items-center gap-3 hover:bg-primary-600 transition-colors text-lg font-medium"
                    >
                      <Download className="w-6 h-6" />
                      Download Resume
                    </a>
                  </div>

                  {/* PDF Viewer */}
                  <div className="bg-white dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden">
                    <div className="relative w-full" style={{ paddingBottom: '141.42%' }}>
                      <iframe
                        src={resumeUrl}
                        className="absolute top-0 left-0 w-full h-full"
                        title="Resume"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Admin Upload Section */}
                  {user?.isAdmin && (
                    <div className="mt-12 p-6 bg-gray-100 dark:bg-dark-surface rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Update Resume (Admin)
                      </h3>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 dark:file:bg-primary-900 dark:file:text-primary-300 cursor-pointer"
                      />
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    No resume available yet.
                  </p>
                  {user?.isAdmin && (
                    <div className="mt-8 p-6 bg-gray-100 dark:bg-dark-surface rounded-lg max-w-md mx-auto">
                      <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 dark:file:bg-primary-900 dark:file:text-primary-300 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
