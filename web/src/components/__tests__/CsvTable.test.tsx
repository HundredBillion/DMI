import { render, screen, within } from '@testing-library/react'
import { CsvTable } from '../CsvTable'
import type { UploadResponse } from '../../types'

describe('CsvTable', () => {
  const baseData: UploadResponse = {
    filename: 'sample.csv',
    headers: ['first', 'last'],
    rows: [
      { first: 'Ada', last: 'Lovelace' },
      { first: 'Alan', last: 'Turing' },
    ],
    rowCount: 2,
    errors: [],
    truncated: false,
  }

  it('renders table headers and rows', () => {
    render(<CsvTable data={baseData} />)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText(/preview: sample.csv/i)).toBeVisible()

    const table = screen.getByRole('table')
    const headerRow = within(table).getAllByRole('columnheader')
    expect(headerRow.map((cell) => cell.textContent)).toEqual(['first', 'last'])

    const cells = within(table).getAllByRole('cell')
    expect(cells.map((cell) => cell.textContent)).toContain('Ada')
  })

  it('shows warnings and truncated badge when provided', () => {
    render(
      <CsvTable
        data={{
          ...baseData,
          errors: ['Row 3 malformed'],
          truncated: true,
        }}
      />,
    )

    expect(screen.getByText(/parser warnings/i)).toBeVisible()
    expect(screen.getByText(/row 3 malformed/i)).toBeVisible()
    expect(screen.getByText(/truncated/i)).toBeVisible()
  })
})
