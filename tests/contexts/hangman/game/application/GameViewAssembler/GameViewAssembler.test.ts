import { describe, expect, test } from 'vitest'
import { GameViewAssembler } from '@/contexts/hangman/game/application/GameViewAssembler/GameViewAssembler'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import { GameMother } from '../../domain/Game/GameMother'

describe('GameViewAssembler', () => {
  test('agrupa la frase en palabras con letras ocultas y la coma visible', () => {
    const view = GameViewAssembler.toView(GameMother.start())
    expect(view.words).toHaveLength(5)
    expect(view.words.flat().filter((cell) => cell.kind === 'letter')).toHaveLength(20)
    expect(view.words.flat().every((cell) => cell.kind === 'symbol' || cell.value === '')).toBe(true)
    expect(view.words[2][view.words[2].length - 1]).toEqual({ kind: 'symbol', value: ',' })
  })

  test('muestra las letras descubiertas en mayúscula con su tilde original', () => {
    const game = GameMother.start()
    game.guess(Letter.from('a'))
    const [mas] = GameViewAssembler.toView(game).words
    expect(mas.map((cell) => cell.value)).toEqual(['', 'Á', ''])
  })

  test('el teclado tiene 27 teclas con su estado', () => {
    const game = GameMother.start()
    game.guess(Letter.from('a'))
    game.guess(Letter.from('z'))
    const keys = GameViewAssembler.toView(game).keys
    expect(keys).toHaveLength(27)
    expect(keys.find((key) => key.label === 'A')?.status).toBe('hit')
    expect(keys.find((key) => key.label === 'Z')?.status).toBe('miss')
    expect(keys.find((key) => key.label === 'Ñ')?.status).toBe('unused')
  })

  test('la solución solo aparece al terminar', () => {
    expect(GameViewAssembler.toView(GameMother.start()).solution).toBeNull()
    const lost = GameViewAssembler.toView(GameMother.lost())
    expect(lost.solution).toBe('Más vale tarde, que nunca')
    expect(lost.words.flat().map((cell) => cell.value).join('')).toBe('MÁSVALETARDE,QUENUNCA')
  })
})
