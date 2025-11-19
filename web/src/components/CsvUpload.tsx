import { useState } from 'react'
import type { FormEvent } from 'react'

interface CsvUploadProps {
  onUpload: (file: File) => Promise<void>
  loading: boolean
}

export function CsvUpload({ onUpload, loading }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    if (!file) {
      setLocalError('Please choose a CSV file before uploading.')
      return
    }

    await onUpload(file)
  }

  return (
    <form className="upload-panel" onSubmit={handleSubmit}>
      <label className="upload-label" htmlFor="csv-file">
        CSV file
      </label>
      <input
        id="csv-file"
        name="file"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null
          setFile(nextFile)
          setLocalError(null)
        }}
        disabled={loading}
      />
      <div className="upload-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading…' : 'Upload CSV'}
        </button>
      </div>
      {localError && <p className="help-text error">{localError}</p>}
    </form>
  )
}
