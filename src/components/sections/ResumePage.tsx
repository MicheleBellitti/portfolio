'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Loader2, Upload } from 'lucide-react'
import AnimatedText from '@/components/ui/AnimatedText'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/config'
import toast from 'react-hot-toast'

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLocalResume, setIsLocalResume] = useState(false)
  const { user } = useAuth()
  
  // Check if Supabase is properly configured
  const supabaseConfigured = isSupabaseConfigured()

  useEffect(() => {
    if (supabaseConfigured) {
      fetchActiveResume()
    } else {
      loadLocalResume()
    }
  }, [supabaseConfigured])

  const loadLocalResume = () => {
    try {
      // Try to load from localStorage
      const savedResumeData = localStorage.getItem('local-resume-data')
      const savedFileName = localStorage.getItem('local-resume-name')
      
      if (savedResumeData && savedFileName) {
        // Convert base64 back to blob
        const byteCharacters = atob(savedResumeData)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        
        // Create object URL
        const url = URL.createObjectURL(blob)
        setResumeUrl(url)
        setUploadedFile(new File([blob], savedFileName, { type: 'application/pdf' }))
        setIsLocalResume(true)
      }
    } catch (error) {
      console.log('Error loading local resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveResume = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) {
        // If table doesn't exist or other error, try to load local resume as fallback
        console.log('Resume fetch error, trying local fallback:', error)
        loadLocalResume()
      } else if (data) {
        setResumeUrl(data.file_url)
        setIsLocalResume(false)
        setLoading(false)
      }
    } catch (error) {
      console.log('Error fetching resume, falling back to local:', error)
      loadLocalResume()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF file')
      return
    }

    setIsUploading(true)

    const saveResumeLocally = async (fileToSave: File) => {
      try {
        // Revoke old URL if it exists
        if (resumeUrl && resumeUrl.startsWith('blob:')) {
          URL.revokeObjectURL(resumeUrl)
        }

        // Create blob URL for immediate display
        const fileUrl = URL.createObjectURL(fileToSave)
        setResumeUrl(fileUrl)
        setUploadedFile(fileToSave)
        setIsLocalResume(true)

        // Convert file to base64 for localStorage
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          const base64Data = base64.split(',')[1] // Remove data:application/pdf;base64, prefix
          
          try {
            localStorage.setItem('local-resume-data', base64Data)
            localStorage.setItem('local-resume-name', fileToSave.name)
            localStorage.setItem('local-resume-date', new Date().toISOString())
            
            setIsLocalResume(true)
            toast.success('Resume saved locally!')
          } catch (storageError) {
            // If localStorage is full, just keep the blob URL
            console.error('LocalStorage error:', storageError)
            toast.success('Resume loaded (temporary - will be lost on refresh)')
          }
        }
        reader.readAsDataURL(fileToSave)
      } catch (error) {
        console.error('Error saving resume locally:', error)
        throw error
      }
    }

    try {
      if (supabaseConfigured) {
        const supabase = createClient()
        
        // Debug: Check if user is authenticated
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        console.log('Current authenticated user:', currentUser)
        
        try {
          // Try to upload to Supabase Storage
          const fileName = `resume-${Date.now()}.pdf`
          console.log('Attempting to upload file to Supabase:', fileName)
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            throw uploadError
          }

          console.log('File uploaded successfully:', uploadData)

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName)

          console.log('Public URL:', publicUrl)

          // Try to save to database
          try {
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

            if (insertError) {
              throw insertError
            }

            setResumeUrl(publicUrl)
            setIsLocalResume(false)
            toast.success('Resume uploaded to cloud successfully!')
          } catch (dbError) {
            console.error('Database error, but file is uploaded:', dbError)
            setResumeUrl(publicUrl)
            setIsLocalResume(false)
            toast.success('Resume uploaded (without database record)')
          }
        } catch (uploadError) {
          // Supabase upload failed, fall back to local storage
          console.log('Supabase upload failed, saving locally:', uploadError)
          toast('⚠️ Cloud upload failed - saving locally instead')
          await saveResumeLocally(file)
        }
      } else {
        // No Supabase configured, save locally
        await saveResumeLocally(file)
      }
    } catch (error) {
      let errorMessage = 'Failed to upload resume'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      toast.error(errorMessage)
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      // Reset the input
      e.target.value = ''
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (resumeUrl && resumeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(resumeUrl)
      }
    }
  }, [resumeUrl])

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
          {!supabaseConfigured && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              (Local storage mode - Resume saved in browser)
            </p>
          )}
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
                  <div className="flex flex-col items-center gap-2">
                    <a
                      href={resumeUrl}
                      download={uploadedFile?.name || 'resume.pdf'}
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
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 dark:file:bg-primary-900 dark:file:text-primary-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {isUploading && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </div>
                      )}
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
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 dark:file:bg-primary-900 dark:file:text-primary-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {isUploading && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </div>
                      )}
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