import { describe, expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocalStoragePlayerStatsRepository } from '@/contexts/hangman/stats/infrastructure/LocalStoragePlayerStatsRepository/LocalStoragePlayerStatsRepository'
import { HangmanContainer } from '@/ui/container/HangmanContainer/HangmanContainer'
import { HangmanProvider } from '@/ui/context/HangmanProvider/HangmanProvider'
import { GamePage } from '@/ui/pages/GamePage/GamePage'

function renderPage(phrase: string = 'Ver para creer') {
  render(
    <HangmanProvider container={new HangmanContainer([phrase])}>
      <GamePage />
    </HangmanProvider>,
  )
}

async function press(...letters: string[]) {
  for (const letter of letters) await userEvent.click(screen.getByRole('button', { name: letter }))
}

describe('GamePage', () => {
  test('empieza con 6 vidas y contadores a 0', () => {
    renderPage()
    expect(screen.getByText('Intentos restantes: 6')).toBeInTheDocument()
    expect(screen.getByText('Victorias: 0')).toBeInTheDocument()
    expect(screen.getByText('Record: 0')).toBeInTheDocument()
  })

  test('ganar, jugar otra, perder y reintentar actualiza los contadores', async () => {
    renderPage()

    await press('V', 'E', 'R', 'P', 'A', 'C')
    const won = screen.getByRole('dialog')
    expect(won).toHaveTextContent('¡Enhorabuena!')
    expect(screen.getByText('Victorias: 1')).toBeInTheDocument()
    expect(screen.getByText('Record: 1')).toBeInTheDocument()

    await userEvent.click(within(won).getByRole('button', { name: 'Otra partida' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Intentos restantes: 6')).toBeInTheDocument()

    await press('B', 'D', 'F', 'G', 'H', 'I')
    const lost = screen.getByRole('dialog')
    expect(lost).toHaveTextContent('Has perdido')
    expect(lost).toHaveTextContent('Ver para creer')
    expect(screen.getByText('Victorias: 0')).toBeInTheDocument()
    expect(screen.getByText('Record: 1')).toBeInTheDocument()

    await userEvent.click(within(lost).getByRole('button', { name: 'Reintentar' }))
    expect(screen.getByText('Intentos restantes: 6')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(LocalStoragePlayerStatsRepository.KEY)!)).toEqual({ streak: 0, record: 1 })
  })

  test('resolver la frase entera gana la partida', async () => {
    renderPage('Más vale tarde, que nunca')
    await userEvent.type(screen.getByRole('textbox', { name: 'Resolver frase' }), 'mas vale tarde que nunca')
    await userEvent.click(screen.getByRole('button', { name: 'Probar' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('¡Enhorabuena!')
  })

  test('restaura los contadores guardados al cargar', () => {
    localStorage.setItem(LocalStoragePlayerStatsRepository.KEY, JSON.stringify({ streak: 2, record: 4 }))
    renderPage()
    expect(screen.getByText('Victorias: 2')).toBeInTheDocument()
    expect(screen.getByText('Record: 4')).toBeInTheDocument()
  })

  test('muestra el tablero oculto con un cuadrado por letra', () => {
    renderPage('Más vale tarde, que nunca')
    const cells = screen.getAllByTestId('cell')
    expect(cells).toHaveLength(20)
    expect(cells.every((cell) => cell.textContent === '')).toBe(true)
  })
})
