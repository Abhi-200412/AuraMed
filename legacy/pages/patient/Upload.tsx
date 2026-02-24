import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import LoadingDots from '../../components/LoadingDots'
import { analyzeImage } from '../../utils/api'

const UploadPage: React.FC = () => {
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    setFilePreview(URL.createObjectURL(f))
    // auto-start analyze for demo
    const runAnalyze = async () => {
      setAnalyzing(true)
      try {
        const fd = new FormData()
        fd.append('file', f)
        const res = await analyzeImage(fd)
        setResult(res?.result ?? 'unknown')
      } catch (err) {
        setResult('error')
      } finally {
        setAnalyzing(false)
      }
    }

    void runAnalyze()
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } })

  return (
    <div className="mt-6">
      <div {...getRootProps()} className="p-6 border-2 border-dashed rounded glass">
        <input {...getInputProps()} />
        <p className="text-slate-300">Drag & drop an image, or click to select</p>
      </div>

      {filePreview && (
        <div className="mt-4 glass p-4 rounded">
          <img src={filePreview} alt="preview" className="max-w-full rounded" />
        </div>
      )}

      {analyzing && (
        <div className="mt-4 flex items-center gap-4">
          <LoadingDots />
          <div>Analyzing with Aura AI...</div>
        </div>
      )}

      {result === 'anomaly' && (
        <div className="mt-4 p-4 glass rounded">
          <h3 className="text-lg">Anomaly detected</h3>
          <p className="text-slate-300">Our AI detected a potential anomaly. This is a placeholder explanation written in plain language to comfort the patient.</p>
          <button className="mt-4 px-4 py-2 bg-rose-500 rounded">Send to Doctor</button>
        </div>
      )}
    </div>
  )
}

export default UploadPage
