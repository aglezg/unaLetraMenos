import { describe, expect, test } from 'vitest'
import { Alphabet } from '@/contexts/hangman/game/domain/Alphabet/Alphabet'

describe('Alphabet', () => {
  test('el alfabeto español tiene las 27 letras de la A a la Z con la Ñ tras la N', () => {
    const values = Alphabet.spanish().letters.map((letter) => letter.value)
    expect(values).toHaveLength(27)
    expect(values.join('')).toBe('abcdefghijklmnñopqrstuvwxyz')
  })
})
