import type { GameView } from '@/contexts/hangman/game/application/GameView/GameView'
import { GameViewAssembler } from '@/contexts/hangman/game/application/GameViewAssembler/GameViewAssembler'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import type { GameRepository } from '@/contexts/hangman/game/domain/GameRepository/GameRepository'
import type { RecordGameResult } from '@/contexts/hangman/stats/application/RecordGameResult/RecordGameResult'

export class SolvePhrase {
  constructor(
    private readonly repository: GameRepository,
    private readonly recordGameResult: RecordGameResult,
  ) {}

  execute(attempt: string): GameView {
    const game = this.repository.current()
    if (!game) throw new GameNotStartedError()

    const wasFinished = game.isFinished()
    game.solve(attempt)
    this.repository.save(game)

    const view = GameViewAssembler.toView(game)
    if (!wasFinished && game.isFinished()) this.recordGameResult.execute(view.status === 'won' ? 'won' : 'lost')
    return view
  }
}
