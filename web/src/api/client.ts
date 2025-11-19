import type { UploadResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/csv_uploads`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorPayload = await safeParseJson(response)
    const message = errorPayload?.errors?.join(', ') || 'Failed to process CSV'
    throw new Error(message)
  }

  return response.json()
}

async function safeParseJson(response: Response) {
  try {
    return await response.clone().json()
  } catch {
    return null
  }
}
