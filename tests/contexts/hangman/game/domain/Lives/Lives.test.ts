import { describe, expect, test } from 'vitest'
import { InvalidLivesError } from '@/contexts/hangman/game/domain/InvalidLivesError/InvalidLivesError'
import { Lives } from '@/contexts/hangman/game/domain/Lives/Lives'

describe('Lives', () => {
  test('empieza con 6 vidas', () => {
    expect(Lives.initial().value).toBe(6)
  })

  test('perder una vida devuelve una nueva con una menos', () => {
    const lives = Lives.initial()
    expect(lives.lose().value).toBe(5)
    expect(lives.value).toBe(6)
  })

  test('se agotan al llegar a 0 y no bajan de 0', () => {
    const last = Lives.fromPrimitives(1).lose()
    expect(last.isExhausted()).toBe(true)
    expect(last.lose().value).toBe(0)
  })

  test.each([-1, 7, 2.5])('%s no es un valor válido', (value) => {
    expect(() => Lives.fromPrimitives(value)).toThrow(InvalidLivesError)
  })
})
