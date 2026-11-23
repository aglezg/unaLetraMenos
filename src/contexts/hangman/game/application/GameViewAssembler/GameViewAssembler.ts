import type { CellView, GameView } from '@/contexts/hangman/game/application/GameView/GameView'
import { Alphabet } from '@/contexts/hangman/game/domain/Alphabet/Alphabet'
import type { Game } from '@/contexts/hangman/game/domain/Game/Game'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'

export class GameViewAssembler {
  static toView(game: Game): GameView {
    const { phrase, lives, status } = game.toPrimitives()

    return {
      words: phrase.split(' ').map((word) => [...word].map((char) => GameViewAssembler.toCell(game, char))),
      keys: Alphabet.spanish().letters.map((letter) => ({
        label: letter.value.toUpperCase(),
        status: game.letterStatus(letter),
      })),
      lives,
      status,
      solution: game.isFinished() ? phrase : null,
    }
  }

  private static toCell(game: Game, char: string): CellView {
    if (!Letter.isValid(char)) return { kind: 'symbol', value: char }
    return { kind: 'letter', value: game.isRevealed(char) ? char.toUpperCase() : '' }
  }
}
