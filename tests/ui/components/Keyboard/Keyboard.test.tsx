import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Keyboard } from '@/ui/components/Keyboard/Keyboard'

const keys = [
  { label: 'A', status: 'hit' as const },
  { label: 'N', status: 'unused' as const },
  { label: 'Ñ', status: 'unused' as const },
  { label: 'Z', status: 'miss' as const },
]

describe('Keyboard', () => {
  test('las teclas sin usar están habilitadas', () => {
    render(<Keyboard keys={keys} disabled={false} onGuess={() => {}} />)
    expect(screen.getByRole('button', { name: 'N' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Ñ' })).toBeEnabled()
  })

  test('al pulsar una letra se envía la jugada', async () => {
    const onGuess = vi.fn()
    render(<Keyboard keys={keys} disabled={false} onGuess={onGuess} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ñ' }))
    expect(onGuess).toHaveBeenCalledWith('Ñ')
  })

  test('las letras usadas quedan desactivadas y marcadas como acierto o fallo', () => {
    render(<Keyboard keys={keys} disabled={false} onGuess={() => {}} />)
    const hit = screen.getByRole('button', { name: 'A' })
    const miss = screen.getByRole('button', { name: 'Z' })
    expect(hit).toBeDisabled()
    expect(hit).toHaveAttribute('data-status', 'hit')
    expect(miss).toBeDisabled()
    expect(miss).toHaveAttribute('data-status', 'miss')
  })

  test('una letra desactivada no se puede volver a pulsar', async () => {
    const onGuess = vi.fn()
    render(<Keyboard keys={keys} disabled={false} onGuess={onGuess} />)
    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(onGuess).not.toHaveBeenCalled()
  })

  test('desactivado bloquea todas las teclas', () => {
    render(<Keyboard keys={keys} disabled onGuess={() => {}} />)
    expect(screen.getByRole('button', { name: 'N' })).toBeDisabled()
  })
})
