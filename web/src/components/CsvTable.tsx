import type { UploadResponse } from '../types'

interface CsvTableProps {
  data: UploadResponse
}

export function CsvTable({ data }: CsvTableProps) {
  const { headers, rows, errors, truncated, filename, rowCount } = data

  if (!headers.length || !rows.length) {
    return (
      <section className="table-panel">
        <p>No rows were returned for {filename}.</p>
      </section>
    )
  }

  return (
    <section className="table-panel" aria-live="polite">
      <header className="table-header">
        <div>
          <h2>Preview: {filename}</h2>
          <p>{rowCount} rows</p>
        </div>
        {truncated && <span className="badge">Truncated</span>}
      </header>

      {errors.length > 0 && (
        <div className="alert warn">
          <strong>Parser warnings:</strong>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`}>{row[header] ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
