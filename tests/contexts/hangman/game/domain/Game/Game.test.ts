import { describe, expect, test } from 'vitest'
import { Game } from '@/contexts/hangman/game/domain/Game/Game'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import { GameMother } from './GameMother'

function guessAll(game: Game, letters: string): Game {
  for (const char of letters) game.guess(Letter.from(char))
  return game
}

describe('Game', () => {
  describe('start', () => {
    test('empieza con 6 vidas, sin letras y en juego', () => {
      expect(GameMother.start().toPrimitives()).toEqual({
        phrase: 'Más vale tarde, que nunca',
        guessedLetters: [],
        lives: 6,
        status: 'playing',
      })
    })

    test('los espacios y signos están desvelados desde el inicio', () => {
      const game = GameMother.start()
      expect(game.isRevealed(' ')).toBe(true)
      expect(game.isRevealed(',')).toBe(true)
      expect(game.isRevealed('v')).toBe(false)
    })
  })

  describe('guess', () => {
    test('una letra acertada desvela todas sus apariciones, con tilde incluida, sin restar vidas', () => {
      const game = guessAll(GameMother.start(), 'A')
      expect(game.toPrimitives().lives).toBe(6)
      expect(game.isRevealed('á')).toBe(true)
      expect(game.isRevealed('a')).toBe(true)
      expect(game.isRevealed('v')).toBe(false)
      expect(game.letterStatus(Letter.from('A'))).toBe('hit')
    })

    test('una letra fallada resta una vida y se marca como fallo', () => {
      const game = guessAll(GameMother.start(), 'z')
      expect(game.toPrimitives().lives).toBe(5)
      expect(game.letterStatus(Letter.from('z'))).toBe('miss')
    })

    test('una letra sin usar está libre', () => {
      expect(GameMother.start().letterStatus(Letter.from('b'))).toBe('unused')
    })

    test('repetir una letra no hace nada', () => {
      const game = guessAll(GameMother.start(), 'z')
      const before = game.toPrimitives()
      game.guess(Letter.from('Z'))
      expect(game.toPrimitives()).toEqual(before)
    })

    test('la Ñ es distinta de la N', () => {
      const withoutN = guessAll(GameMother.start('El año acaba'), 'n')
      expect(withoutN.toPrimitives().lives).toBe(5)
      expect(withoutN.isRevealed('ñ')).toBe(false)

      const withEnie = guessAll(GameMother.start('Año de nieves'), 'ñ')
      expect(withEnie.toPrimitives().lives).toBe(6)
      expect(withEnie.isRevealed('ñ')).toBe(true)
      expect(withEnie.isRevealed('n')).toBe(false)
    })

    test('descubrir la última letra gana la partida', () => {
      const game = guessAll(GameMother.start('Ver para creer'), 'verpac')
      expect(game.toPrimitives().status).toBe('won')
      expect(game.isFinished()).toBe(true)
    })

    test('la sexta equivocación pierde la partida y desvela la frase', () => {
      const game = guessAll(GameMother.start(), 'bfghij')
      expect(game.toPrimitives()).toMatchObject({ lives: 0, status: 'lost' })
      expect(game.isRevealed('v')).toBe(true)
    })
  })

  describe('solve', () => {
    test('acertar la frase ignorando mayúsculas, tildes y puntuación gana', () => {
      const game = GameMother.start()
      game.solve('mas vale tarde que nunca')
      expect(game.toPrimitives()).toMatchObject({ lives: 6, status: 'won' })
    })

    test('acertar con espacios sobrantes también gana', () => {
      const game = GameMother.start()
      game.solve('  MÁS  vale tarde,   que nunca ')
      expect(game.toPrimitives().status).toBe('won')
    })

    test('fallar la frase resta una vida y la partida sigue', () => {
      const game = GameMother.with({ lives: 3 })
      game.solve('mas vale nunca que tarde')
      expect(game.toPrimitives()).toMatchObject({ lives: 2, status: 'playing' })
    })

    test('fallar la frase con 1 vida pierde', () => {
      const game = GameMother.with({ lives: 1 })
      game.solve('otra cosa')
      expect(game.toPrimitives().status).toBe('lost')
    })

    test.each(['', '   '])('un envío vacío ("%s") no hace nada', (attempt) => {
      const game = GameMother.start()
      game.solve(attempt)
      expect(game.toPrimitives()).toEqual(GameMother.start().toPrimitives())
    })
  })

  describe('partida terminada', () => {
    test.each([GameMother.won, GameMother.lost])('ignora letras e intentos de resolver', (finished) => {
      const game = finished()
      const before = game.toPrimitives()
      game.guess(Letter.from('z'))
      game.solve('Más vale tarde, que nunca')
      expect(game.toPrimitives()).toEqual(before)
    })
  })

  test('se reconstruye desde sus primitivos', () => {
    const game = guessAll(GameMother.start(), 'az')
    expect(Game.fromPrimitives(game.toPrimitives()).toPrimitives()).toEqual(game.toPrimitives())
  })
})
