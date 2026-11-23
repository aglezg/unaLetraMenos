import { GameStatus, type GameStatusValue } from '@/contexts/hangman/game/domain/GameStatus/GameStatus'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import type { LetterStatus } from '@/contexts/hangman/game/domain/LetterStatus/LetterStatus'
import { Lives } from '@/contexts/hangman/game/domain/Lives/Lives'
import { Phrase } from '@/contexts/hangman/game/domain/Phrase/Phrase'

export interface GamePrimitives {
  phrase: string
  guessedLetters: string[]
  lives: number
  status: GameStatusValue
}

export class Game {
  private constructor(
    private readonly phrase: Phrase,
    private guessedLetters: Letter[],
    private lives: Lives,
    private status: GameStatus,
  ) {}

  static start(phrase: Phrase): Game {
    return new Game(phrase, [], Lives.initial(), GameStatus.playing())
  }

  static fromPrimitives(primitives: GamePrimitives): Game {
    return new Game(
      Phrase.create(primitives.phrase),
      primitives.guessedLetters.map((char) => Letter.from(char)),
      Lives.fromPrimitives(primitives.lives),
      GameStatus.fromPrimitives(primitives.status),
    )
  }

  /** Letra ya usada o partida terminada: la jugada se ignora. */
  guess(letter: Letter): void {
    if (this.status.isFinished() || this.hasGuessed(letter)) return

    this.guessedLetters = [...this.guessedLetters, letter]
    if (!this.phrase.contains(letter)) {
      this.loseLife()
      return
    }
    if (this.phrase.letters().every((own) => this.hasGuessed(own))) this.status = GameStatus.won()
  }

  /** Intento vacío o partida terminada: la jugada se ignora. */
  solve(attempt: string): void {
    if (this.status.isFinished() || attempt.trim() === '') return

    if (this.phrase.matches(attempt)) this.status = GameStatus.won()
    else this.loseLife()
  }

  isRevealed(char: string): boolean {
    if (!Letter.isValid(char) || this.status.isFinished()) return true
    return this.hasGuessed(Letter.from(char))
  }

  letterStatus(letter: Letter): LetterStatus {
    if (!this.hasGuessed(letter)) return 'unused'
    return this.phrase.contains(letter) ? 'hit' : 'miss'
  }

  isFinished(): boolean {
    return this.status.isFinished()
  }

  toPrimitives(): GamePrimitives {
    return {
      phrase: this.phrase.text,
      guessedLetters: this.guessedLetters.map((letter) => letter.value),
      lives: this.lives.value,
      status: this.status.value,
    }
  }

  private hasGuessed(letter: Letter): boolean {
    return this.guessedLetters.some((guessed) => guessed.equals(letter))
  }

  private loseLife(): void {
    this.lives = this.lives.lose()
    if (this.lives.isExhausted()) this.status = GameStatus.lost()
  }
}
