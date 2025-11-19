import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CsvUpload } from '../CsvUpload'

describe('CsvUpload', () => {
  it('submits the selected file', async () => {
    const user = userEvent.setup()
    const onUpload = vi.fn().mockResolvedValue(undefined)

    render(<CsvUpload onUpload={onUpload} loading={false} />)

    const input = screen.getByLabelText(/csv file/i)
    const submit = screen.getByRole('button', { name: /upload csv/i })

    const file = new File(['content'], 'data.csv', { type: 'text/csv' })
    await user.upload(input, file)
    await user.click(submit)

    expect(onUpload).toHaveBeenCalledWith(file)
  })

  it('shows an inline error when no file selected', async () => {
    const user = userEvent.setup()
    const onUpload = vi.fn().mockResolvedValue(undefined)

    render(<CsvUpload onUpload={onUpload} loading={false} />)

    await user.click(screen.getByRole('button', { name: /upload csv/i }))

    expect(screen.getByText(/please choose a csv/i)).toBeVisible()
    expect(onUpload).not.toHaveBeenCalled()
  })
})
