import type { PlayerStatsView } from '@/contexts/hangman/stats/application/PlayerStatsView/PlayerStatsView'
import type { PlayerStatsRepository } from '@/contexts/hangman/stats/domain/PlayerStatsRepository/PlayerStatsRepository'

export class GetPlayerStats {
  constructor(private readonly repository: PlayerStatsRepository) {}

  execute(): PlayerStatsView {
    return this.repository.find().toPrimitives()
  }
}
