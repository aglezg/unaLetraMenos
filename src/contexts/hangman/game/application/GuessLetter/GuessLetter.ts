import type { GameView } from '@/contexts/hangman/game/application/GameView/GameView'
import { GameViewAssembler } from '@/contexts/hangman/game/application/GameViewAssembler/GameViewAssembler'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import type { GameRepository } from '@/contexts/hangman/game/domain/GameRepository/GameRepository'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import type { RecordGameResult } from '@/contexts/hangman/stats/application/RecordGameResult/RecordGameResult'

export class GuessLetter {
  constructor(
    private readonly repository: GameRepository,
    private readonly recordGameResult: RecordGameResult,
  ) {}

  /** Algo que no es una letra se ignora, igual que una letra repetida. */
  execute(letter: string): GameView {
    const game = this.repository.current()
    if (!game) throw new GameNotStartedError()
    if (!Letter.isValid(letter)) return GameViewAssembler.toView(game)

    const wasFinished = game.isFinished()
    game.guess(Letter.from(letter))
    this.repository.save(game)

    const view = GameViewAssembler.toView(game)
    if (!wasFinished && game.isFinished()) this.recordGameResult.execute(view.status === 'won' ? 'won' : 'lost')
    return view
  }
}
