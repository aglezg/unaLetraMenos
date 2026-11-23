import { describe, expect, test } from 'vitest'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import { HangmanTestContext } from '../HangmanTestContext'

describe('SolvePhrase', () => {
  test('acertar gana, revela la solución y suma una victoria una sola vez', () => {
    const context = new HangmanTestContext('Más vale tarde, que nunca')
    context.startGame.execute()
    const view = context.solvePhrase.execute('mas vale tarde que nunca')
    context.solvePhrase.execute('mas vale tarde que nunca')
    expect(view).toMatchObject({ status: 'won', solution: 'Más vale tarde, que nunca' })
    expect(context.stats.find().toPrimitives()).toEqual({ streak: 1, record: 1 })
  })

  test('fallar resta una vida', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    expect(context.solvePhrase.execute('otra cosa').lives).toBe(5)
  })

  test('fallar con la última vida pierde y cuenta la derrota', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    context.guessAll('bdfgh')
    expect(context.solvePhrase.execute('otra cosa').status).toBe('lost')
    expect(context.stats.find().toPrimitives()).toEqual({ streak: 0, record: 0 })
  })

  test('falla si no hay partida', () => {
    expect(() => new HangmanTestContext().solvePhrase.execute('x')).toThrow(GameNotStartedError)
  })
})
