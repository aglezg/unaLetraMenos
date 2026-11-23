import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResultModal } from '@/ui/components/ResultModal/ResultModal'

const PHRASE = 'Ver para creer'

describe('ResultModal', () => {
  test('no se muestra durante la partida', () => {
    render(<ResultModal status="playing" solution={null} onNewGame={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('al ganar felicita y ofrece otra partida', async () => {
    const onNewGame = vi.fn()
    render(<ResultModal status="won" solution={PHRASE} onNewGame={onNewGame} />)
    expect(screen.getByRole('dialog')).toHaveTextContent('¡Enhorabuena!')
    await userEvent.click(screen.getByRole('button', { name: 'Otra partida' }))
    expect(onNewGame).toHaveBeenCalled()
  })

  test('al perder revela la frase y ofrece reintentar', async () => {
    const onNewGame = vi.fn()
    render(<ResultModal status="lost" solution={PHRASE} onNewGame={onNewGame} />)
    expect(screen.getByRole('dialog')).toHaveTextContent('Has perdido')
    expect(screen.getByRole('dialog')).toHaveTextContent(PHRASE)
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onNewGame).toHaveBeenCalled()
  })
})
