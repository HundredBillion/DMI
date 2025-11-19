export interface UploadResponse {
  filename: string
  headers: string[]
  rows: Record<string, string>[]
  rowCount: number
  errors: string[]
  truncated: boolean
}

export type CsvRow = Record<string, string>
