import { describe, expect, test } from 'vitest'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import { HangmanTestContext } from '../HangmanTestContext'

describe('GetCurrentGame', () => {
  test('devuelve la partida en curso', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    context.guessLetter.execute('z')
    expect(context.getCurrentGame.execute().lives).toBe(5)
  })

  test('falla si no hay partida', () => {
    expect(() => new HangmanTestContext().getCurrentGame.execute()).toThrow(GameNotStartedError)
  })
})
