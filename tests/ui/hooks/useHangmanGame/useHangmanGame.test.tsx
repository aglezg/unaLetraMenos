import { StrictMode, type ReactNode } from 'react'
import { describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { HangmanContainer } from '@/ui/container/HangmanContainer/HangmanContainer'
import { HangmanProvider } from '@/ui/context/HangmanProvider/HangmanProvider'
import { useHangmanGame } from '@/ui/hooks/useHangmanGame/useHangmanGame'

function renderGame(phrases: readonly string[] = ['Ver para creer']) {
  const container = new HangmanContainer(phrases)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StrictMode>
      <HangmanProvider container={container}>{children}</HangmanProvider>
    </StrictMode>
  )
  return { container, ...renderHook(() => useHangmanGame(), { wrapper }) }
}

describe('useHangmanGame', () => {
  test('empieza una partida al montarse, la misma que guarda el contenedor (también en StrictMode)', () => {
    const { result, container } = renderGame()
    expect(result.current.game).toMatchObject({ lives: 6, status: 'playing' })
    expect(container.getCurrentGame.execute()).toEqual(result.current.game)
  })

  test('jugar actualiza la partida y las estadísticas', () => {
    const { result } = renderGame()
    for (const letter of 'VERPAC') act(() => result.current.guess(letter))
    expect(result.current.game.status).toBe('won')
    expect(result.current.stats).toEqual({ streak: 1, record: 1 })

    act(() => result.current.newGame())
    expect(result.current.game.status).toBe('playing')

    act(() => result.current.solve('otra cosa'))
    expect(result.current.game.lives).toBe(5)
  })

  test('fuera del provider avisa con un error claro', () => {
    expect(() => renderHook(() => useHangmanGame())).toThrow(/HangmanProvider/)
  })
})
