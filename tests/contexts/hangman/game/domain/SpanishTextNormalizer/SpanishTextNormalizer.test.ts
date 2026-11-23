import { describe, expect, test } from 'vitest'
import { SpanishTextNormalizer } from '@/contexts/hangman/game/domain/SpanishTextNormalizer/SpanishTextNormalizer'

describe('SpanishTextNormalizer', () => {
  describe('normalize', () => {
    test('pasa a minúsculas y quita tildes y diéresis', () => {
      expect(SpanishTextNormalizer.normalize('ÁéÜ')).toBe('aeu')
    })

    test('conserva la ñ', () => {
      expect(SpanishTextNormalizer.normalize('Ñ')).toBe('ñ')
    })
  })

  describe('normalizeSentence', () => {
    test('ignora mayúsculas, tildes y puntuación', () => {
      expect(SpanishTextNormalizer.normalizeSentence('Más vale tarde, que nunca')).toBe('mas vale tarde que nunca')
    })

    test('colapsa y recorta espacios', () => {
      expect(SpanishTextNormalizer.normalizeSentence('  mas   vale tarde que  nunca ')).toBe('mas vale tarde que nunca')
    })

    test('conserva la ñ', () => {
      expect(SpanishTextNormalizer.normalizeSentence('Año de nieves, año de bienes')).toBe('año de nieves año de bienes')
    })

    test('quita signos de apertura y cierre', () => {
      expect(SpanishTextNormalizer.normalizeSentence('¡A quién madruga!')).toBe('a quien madruga')
    })
  })
})
