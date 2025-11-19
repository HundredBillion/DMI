import { useState } from 'react'
import './App.css'
import { uploadCsv } from './api/client'
import { CsvTable } from './components/CsvTable'
import { CsvUpload } from './components/CsvUpload'
import type { UploadResponse } from './types'

function App() {
  const [result, setResult] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      const response = await uploadCsv(file)
      setResult(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to upload file'
      setError(message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="app-shell">
      <header>
        <div>
          <p className="eyebrow">CSV Toolkit</p>
          <h1>Upload a CSV and preview it instantly</h1>
        </div>
        {result && (
          <button className="ghost" onClick={handleReset} disabled={loading}>
            Clear result
          </button>
        )}
      </header>

      <main>
        <CsvUpload onUpload={handleUpload} loading={loading} />

        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        {result && <CsvTable data={result} />}
      </main>
    </div>
  )
}

export default App
