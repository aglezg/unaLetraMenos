import type { GameView } from '@/contexts/hangman/game/application/GameView/GameView'
import { GameViewAssembler } from '@/contexts/hangman/game/application/GameViewAssembler/GameViewAssembler'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import type { GameRepository } from '@/contexts/hangman/game/domain/GameRepository/GameRepository'

export class GetCurrentGame {
  constructor(private readonly repository: GameRepository) {}

  execute(): GameView {
    const game = this.repository.current()
    if (!game) throw new GameNotStartedError()
    return GameViewAssembler.toView(game)
  }
}
