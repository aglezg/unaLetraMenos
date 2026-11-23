import { InvalidLetterError } from '@/contexts/hangman/game/domain/InvalidLetterError/InvalidLetterError'
import { SpanishTextNormalizer } from '@/contexts/hangman/game/domain/SpanishTextNormalizer/SpanishTextNormalizer'

/** Letra del alfabeto español normalizada: minúscula, sin tildes ni diéresis, con la ñ propia. */
export class Letter {
  private constructor(readonly value: string) {}

  static isValid(char: string): boolean {
    return /^[a-zñ]$/.test(SpanishTextNormalizer.normalize(char))
  }

  static from(char: string): Letter {
    if (!Letter.isValid(char)) throw new InvalidLetterError(char)
    return new Letter(SpanishTextNormalizer.normalize(char))
  }

  equals(other: Letter): boolean {
    return this.value === other.value
  }
}
