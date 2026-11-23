import { describe, expect, test } from 'vitest'
import { InvalidLetterError } from '@/contexts/hangman/game/domain/InvalidLetterError/InvalidLetterError'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'

describe('Letter', () => {
  test('se normaliza a minúscula', () => {
    expect(Letter.from('A').value).toBe('a')
  })

  test('ignora tildes y diéresis', () => {
    expect(Letter.from('Á').equals(Letter.from('a'))).toBe(true)
    expect(Letter.from('Ü').equals(Letter.from('u'))).toBe(true)
  })

  test('la ñ es una letra distinta de la n', () => {
    expect(Letter.from('Ñ').value).toBe('ñ')
    expect(Letter.from('ñ').equals(Letter.from('n'))).toBe(false)
  })

  test.each(['a', 'Z', 'ñ', 'Á', 'ü'])('"%s" es una letra válida', (char) => {
    expect(Letter.isValid(char)).toBe(true)
  })

  test.each([' ', ',', '.', '¿', '?', '¡', '!', ';', 'ab', ''])('"%s" no es una letra válida', (char) => {
    expect(Letter.isValid(char)).toBe(false)
    expect(() => Letter.from(char)).toThrow(InvalidLetterError)
  })
})
