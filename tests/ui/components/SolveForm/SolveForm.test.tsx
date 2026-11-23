import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SolveForm } from '@/ui/components/SolveForm/SolveForm'

describe('SolveForm', () => {
  test('envía lo escrito y limpia el campo', async () => {
    const onSolve = vi.fn()
    render(<SolveForm disabled={false} onSolve={onSolve} />)
    const input = screen.getByRole('textbox', { name: 'Resolver frase' })
    await userEvent.type(input, 'ver para creer')
    await userEvent.click(screen.getByRole('button', { name: 'Probar' }))
    expect(onSolve).toHaveBeenCalledWith('ver para creer')
    expect(input).toHaveValue('')
  })

  test('desactivado no permite enviar', () => {
    render(<SolveForm disabled onSolve={() => {}} />)
    expect(screen.getByRole('button', { name: 'Probar' })).toBeDisabled()
  })
})
