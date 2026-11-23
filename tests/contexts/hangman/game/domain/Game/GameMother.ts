import { Game, type GamePrimitives } from '@/contexts/hangman/game/domain/Game/Game'
import { Phrase } from '@/contexts/hangman/game/domain/Phrase/Phrase'

export const DEFAULT_PHRASE = 'Más vale tarde, que nunca'

export class GameMother {
  static start(phrase: string = DEFAULT_PHRASE): Game {
    return Game.start(Phrase.create(phrase))
  }

  static with(overrides: Partial<GamePrimitives>): Game {
    return Game.fromPrimitives({ phrase: DEFAULT_PHRASE, guessedLetters: [], lives: 6, status: 'playing', ...overrides })
  }

  static won(phrase: string = DEFAULT_PHRASE): Game {
    return GameMother.with({ phrase, status: 'won' })
  }

  static lost(phrase: string = DEFAULT_PHRASE): Game {
    return GameMother.with({ phrase, lives: 0, status: 'lost' })
  }
}
