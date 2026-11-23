import { describe, expect, test } from 'vitest'
import { PhrasePicker } from '@/contexts/hangman/phrase/domain/PhrasePicker/PhrasePicker'
import { InMemoryPhraseRepository } from '@/contexts/hangman/phrase/infrastructure/InMemoryPhraseRepository/InMemoryPhraseRepository'
import { MathRandomGenerator } from '@/contexts/hangman/phrase/infrastructure/MathRandomGenerator/MathRandomGenerator'

describe('PhrasePicker', () => {
  const repository = new InMemoryPhraseRepository()
  const phrases = repository.all()

  test('devuelve frases del catálogo', () => {
    const picker = new PhrasePicker(repository, new MathRandomGenerator())
    expect(phrases).toContain(picker.pick())
  })

  test('no repite frases hasta agotar el catálogo', () => {
    const picker = new PhrasePicker(repository, new MathRandomGenerator())
    const picked = Array.from({ length: phrases.length }, () => picker.pick())
    expect(new Set(picked).size).toBe(phrases.length)
  })

  test('vuelve a empezar con el catálogo completo al agotarlo', () => {
    const picker = new PhrasePicker(repository, new MathRandomGenerator())
    for (let i = 0; i < phrases.length; i++) picker.pick()
    expect(phrases).toContain(picker.pick())
  })

  test('usa el generador aleatorio recibido', () => {
    const picker = new PhrasePicker(new InMemoryPhraseRepository(['uno', 'dos', 'tres']), { next: () => 0.99 })
    expect(picker.pick()).toBe('tres')
    expect(picker.pick()).toBe('dos')
    expect(picker.pick()).toBe('uno')
  })
})
