// components/admin/CVEditor.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Save, Palette, Type, Layout, Plus, Trash2 } from 'lucide-react'
import AnimatedText from '@/components/ui/AnimatedText'
import toast from 'react-hot-toast'

interface CVSection {
  id: string
  type: 'header' | 'section' | 'text' | 'list'
  content: any
}

export default function CVEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [sections, setSections] = useState<CVSection[]>([])
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const [fabric, setFabric] = useState<any>(null)

  useEffect(() => {
    // Dynamically import fabric.js
    import('fabric').then((fabricModule) => {
      setFabric(fabricModule)
      setFabricLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (fabricLoaded && fabric && canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 595, // A4 width in pixels at 72 DPI
        height: 842, // A4 height in pixels at 72 DPI
        backgroundColor: '#ffffff',
      })

      fabricCanvas.on('selection:created', (e: any) => {
        setSelectedObject(e.selected?.[0] || null)
      })

      fabricCanvas.on('selection:updated', (e: any) => {
        setSelectedObject(e.selected?.[0] || null)
      })

      fabricCanvas.on('selection:cleared', () => {
        setSelectedObject(null)
      })

      setCanvas(fabricCanvas)

      // Initialize with basic template
      initializeTemplate(fabricCanvas)

      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [fabricLoaded, fabric])

  const initializeTemplate = (canvas: any) => {
    if (!fabric) return

    // Header
    const header = new fabric.FabricText('Michele Bellitti', {
      left: 50,
      top: 50,
      fontSize: 32,
      fontWeight: 'bold',
      fill: '#1a1a1a',
    })

    const subtitle = new fabric.FabricText('AI Engineer & Developer', {
      left: 50,
      top: 90,
      fontSize: 18,
      fill: '#38d9a9',
    })

    const contact = new fabric.FabricText(
      'michelebellitti272@gmail.com | +39 333 928 7528',
      {
        left: 50,
        top: 120,
        fontSize: 14,
        fill: '#666666',
      }
    )

    canvas.add(header, subtitle, contact)
  }

  const addTextElement = () => {
    if (!canvas || !fabric) return

    const text = new fabric.IText('Click to edit text', {
      left: 50,
      top: 200,
      fontSize: 14,
      fill: '#1a1a1a',
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  const addSection = (title: string) => {
    if (!canvas || !fabric) return

    const sectionTitle = new fabric.FabricText(title, {
      left: 50,
      top: 250,
      fontSize: 20,
      fontWeight: 'bold',
      fill: '#38d9a9',
    })

    const line = new fabric.Line([50, 280, 545, 280], {
      stroke: '#38d9a9',
      strokeWidth: 2,
    })

    canvas.add(sectionTitle, line)
    canvas.renderAll()
  }

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return

    canvas.remove(selectedObject)
    setSelectedObject(null)
    canvas.renderAll()
  }

  const changeTextColor = (color: string) => {
    if (!selectedObject || !('text' in selectedObject)) return

    selectedObject.set('fill', color)
    canvas?.renderAll()
  }

  const changeFontSize = (size: number) => {
    if (!selectedObject || !('fontSize' in selectedObject)) return

    selectedObject.set('fontSize', size)
    canvas?.renderAll()
  }

  const exportToPDF = () => {
    if (!canvas) return

    // Convert canvas to PDF using jsPDF (would need to be imported)
    toast.success('PDF export functionality would be implemented here')
  }

  const saveTemplate = () => {
    if (!canvas) return

    const json = canvas.toJSON()
    localStorage.setItem('cv-template', JSON.stringify(json))
    toast.success('Template saved!')
  }

  if (!fabricLoaded) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Loading CV Editor...</h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">
            <AnimatedText>CV Editor</AnimatedText>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Design your CV with our visual editor
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass-effect rounded-xl p-6 space-y-6 sticky top-24">
              <h3 className="font-semibold mb-4">Tools</h3>

              {/* Add Elements */}
              <div className="space-y-3">
                <button
                  onClick={addTextElement}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                >
                  <Type className="w-5 h-5" />
                  Add Text
                </button>

                <button
                  onClick={() => addSection('Experience')}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                >
                  <Layout className="w-5 h-5" />
                  Add Section
                </button>

                <button
                  onClick={deleteSelected}
                  disabled={!selectedObject}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Selected
                </button>
              </div>

              {/* Text Properties */}
              {selectedObject && 'text' in selectedObject && (
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-dark-border">
                  <h4 className="font-medium">Text Properties</h4>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Color
                    </label>
                    <div className="flex gap-2 mt-1">
                      {['#1a1a1a', '#38d9a9', '#666666', '#ef4444'].map(
                        (color) => (
                          <button
                            key={color}
                            onClick={() => changeTextColor(color)}
                            className="w-8 h-8 rounded-lg"
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Font Size
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="48"
                      defaultValue="14"
                      onChange={(e) => changeFontSize(parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-dark-border">
                <button
                  onClick={saveTemplate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Template
                </button>

                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass-effect hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export PDF
                </button>
              </div>
            </div>
          </motion.div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="glass-effect rounded-xl p-8 overflow-auto">
              <div className="mx-auto" style={{ width: '595px' }}>
                <canvas
                  ref={canvasRef}
                  className="shadow-lg"
                  style={{ border: '1px solid #e5e7eb' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}