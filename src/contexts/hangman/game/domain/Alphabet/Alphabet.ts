import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'

const SPANISH_LETTERS = [...'abcdefghijklmnñopqrstuvwxyz']

export class Alphabet {
  private constructor(readonly letters: readonly Letter[]) {}

  static spanish(): Alphabet {
    return new Alphabet(SPANISH_LETTERS.map((char) => Letter.from(char)))
  }
}
