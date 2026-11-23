import { describe, expect, test } from 'vitest'
import { HangmanTestContext } from '../HangmanTestContext'

describe('StartGame', () => {
  test('empieza una partida nueva con la frase elegida y la guarda', () => {
    const context = new HangmanTestContext('Ver para creer')
    const view = context.startGame.execute()
    expect(view).toMatchObject({ lives: 6, status: 'playing', solution: null })
    expect(context.games.current()?.toPrimitives().phrase).toBe('Ver para creer')
  })

  test('sustituye a la partida anterior aunque estuviera terminada', () => {
    const context = new HangmanTestContext()
    context.startGame.execute()
    context.solvePhrase.execute('ver para creer')
    expect(context.startGame.execute().status).toBe('playing')
  })
})
