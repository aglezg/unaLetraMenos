import { InvalidPhraseError } from '@/contexts/hangman/game/domain/InvalidPhraseError/InvalidPhraseError'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import { SpanishTextNormalizer } from '@/contexts/hangman/game/domain/SpanishTextNormalizer/SpanishTextNormalizer'

export class Phrase {
  private constructor(readonly text: string) {}

  static create(text: string): Phrase {
    if (![...text].some(Letter.isValid)) throw new InvalidPhraseError(text)
    return new Phrase(text)
  }

  letters(): Letter[] {
    const unique = new Map<string, Letter>()
    for (const char of this.text) {
      if (!Letter.isValid(char)) continue
      const letter = Letter.from(char)
      unique.set(letter.value, letter)
    }
    return [...unique.values()]
  }

  contains(letter: Letter): boolean {
    return this.letters().some((own) => own.equals(letter))
  }

  matches(attempt: string): boolean {
    return SpanishTextNormalizer.normalizeSentence(attempt) === SpanishTextNormalizer.normalizeSentence(this.text)
  }
}
