import { Game, type GamePrimitives } from '@/contexts/hangman/game/domain/Game/Game'
import type { GameRepository } from '@/contexts/hangman/game/domain/GameRepository/GameRepository'

// Guarda primitivos y no la instancia, para que nadie modifique la partida guardada sin pasar por save().
export class InMemoryGameRepository implements GameRepository {
  private stored: GamePrimitives | null = null

  save(game: Game): void {
    this.stored = game.toPrimitives()
  }

  current(): Game | null {
    return this.stored ? Game.fromPrimitives(this.stored) : null
  }
}
