import { describe, expect, test } from 'vitest'
import { InvalidPhraseError } from '@/contexts/hangman/game/domain/InvalidPhraseError/InvalidPhraseError'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import { Phrase } from '@/contexts/hangman/game/domain/Phrase/Phrase'

describe('Phrase', () => {
  const phrase = Phrase.create('Más vale tarde, que nunca')

  test('conserva el texto original', () => {
    expect(phrase.text).toBe('Más vale tarde, que nunca')
  })

  test('sus letras son las letras normalizadas sin repetir', () => {
    expect(phrase.letters().map((letter) => letter.value).sort().join('')).toBe('acdelmnqrstuv')
  })

  test('contiene una letra aunque aparezca con tilde', () => {
    expect(phrase.contains(Letter.from('a'))).toBe(true)
    expect(phrase.contains(Letter.from('z'))).toBe(false)
  })

  test('la ñ no cuenta como n', () => {
    expect(Phrase.create('El año acaba').contains(Letter.from('n'))).toBe(false)
  })

  test.each(['mas vale tarde que nunca', '  MÁS  vale tarde,   que nunca ', 'Más vale tarde, que nunca'])(
    'coincide con "%s"',
    (attempt) => {
      expect(phrase.matches(attempt)).toBe(true)
    },
  )

  test('no coincide con otra frase', () => {
    expect(phrase.matches('mas vale nunca que tarde')).toBe(false)
  })

  test.each(['', '  ', ', .'])('no se puede crear sin letras ("%s")', (text) => {
    expect(() => Phrase.create(text)).toThrow(InvalidPhraseError)
  })
})
