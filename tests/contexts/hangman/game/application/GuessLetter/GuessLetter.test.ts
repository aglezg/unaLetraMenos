import { describe, expect, test } from 'vitest'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import { HangmanTestContext } from '../HangmanTestContext'

describe('GuessLetter', () => {
  test('aplica la letra y guarda la partida', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    const view = context.guessLetter.execute('V')
    expect(view.keys.find((key) => key.label === 'V')?.status).toBe('hit')
    expect(context.games.current()?.toPrimitives().guessedLetters).toEqual(['v'])
  })

  test('ignora lo que no es una letra', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    expect(context.guessLetter.execute('?').lives).toBe(6)
    expect(context.games.current()?.toPrimitives().guessedLetters).toEqual([])
  })

  test('al ganar suma una victoria una sola vez', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    context.guessAll('verpac')
    context.guessAll('zxyw')
    expect(context.stats.find().toPrimitives()).toEqual({ streak: 1, record: 1 })
  })

  test('al perder resetea la racha una sola vez', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    context.guessAll('verpac')
    context.startGame.execute()
    context.guessAll('bdfghi')
    context.guessAll('jklm')
    expect(context.stats.find().toPrimitives()).toEqual({ streak: 0, record: 1 })
  })

  test('una partida en curso no cambia las estadísticas', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    context.guessAll('vz')
    expect(context.stats.find().toPrimitives()).toEqual({ streak: 0, record: 0 })
  })

  test('falla si no hay partida', () => {
    expect(() => new HangmanTestContext().guessLetter.execute('a')).toThrow(GameNotStartedError)
  })
})
