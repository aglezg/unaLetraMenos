import { describe, expect, test } from 'vitest'
import { InMemoryPhraseRepository } from '@/contexts/hangman/phrase/infrastructure/InMemoryPhraseRepository/InMemoryPhraseRepository'

describe('InMemoryPhraseRepository', () => {
  const phrases = new InMemoryPhraseRepository().all()

  test('contiene exactamente 100 frases', () => {
    expect(phrases).toHaveLength(100)
  })

  test('no tiene duplicados', () => {
    const unique = new Set(phrases.map((phrase) => phrase.toLowerCase()))
    expect(unique.size).toBe(phrases.length)
  })

  test.each(phrases)('"%s" mide entre 20 y 60 caracteres', (phrase) => {
    expect(phrase.length).toBeGreaterThanOrEqual(20)
    expect(phrase.length).toBeLessThanOrEqual(60)
  })

  test.each(phrases)('"%s" solo usa letras españolas, espacios y signos', (phrase) => {
    expect(phrase).toMatch(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ,.;:¡!¿?]+$/)
  })

  test('acepta un catálogo propio', () => {
    expect(new InMemoryPhraseRepository(['Ver para creer']).all()).toEqual(['Ver para creer'])
  })
})
