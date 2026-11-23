import type { GameView } from '@/contexts/hangman/game/application/GameView/GameView'
import { GameViewAssembler } from '@/contexts/hangman/game/application/GameViewAssembler/GameViewAssembler'
import { Game } from '@/contexts/hangman/game/domain/Game/Game'
import type { GameRepository } from '@/contexts/hangman/game/domain/GameRepository/GameRepository'
import { Phrase } from '@/contexts/hangman/game/domain/Phrase/Phrase'
import type { PhrasePicker } from '@/contexts/hangman/phrase/domain/PhrasePicker/PhrasePicker'

export class StartGame {
  constructor(
    private readonly repository: GameRepository,
    private readonly phrasePicker: PhrasePicker,
  ) {}

  execute(): GameView {
    const game = Game.start(Phrase.create(this.phrasePicker.pick()))
    this.repository.save(game)
    return GameViewAssembler.toView(game)
  }
}
