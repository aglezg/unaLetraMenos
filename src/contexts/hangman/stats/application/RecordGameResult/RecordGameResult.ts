import type { PlayerStatsView } from '@/contexts/hangman/stats/application/PlayerStatsView/PlayerStatsView'
import type { PlayerStatsRepository } from '@/contexts/hangman/stats/domain/PlayerStatsRepository/PlayerStatsRepository'

export class RecordGameResult {
  constructor(private readonly repository: PlayerStatsRepository) {}

  execute(result: 'won' | 'lost'): PlayerStatsView {
    const stats = this.repository.find()
    if (result === 'won') stats.recordWin()
    else stats.recordLoss()
    this.repository.save(stats)
    return stats.toPrimitives()
  }
}
