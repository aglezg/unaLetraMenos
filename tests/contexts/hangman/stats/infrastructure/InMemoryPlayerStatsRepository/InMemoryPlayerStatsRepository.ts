import { PlayerStats, type PlayerStatsPrimitives } from '@/contexts/hangman/stats/domain/PlayerStats/PlayerStats'
import type { PlayerStatsRepository } from '@/contexts/hangman/stats/domain/PlayerStatsRepository/PlayerStatsRepository'

/** Doble de test: repositorio en memoria sin tocar localStorage. */
export class InMemoryPlayerStatsRepository implements PlayerStatsRepository {
  private stored: PlayerStatsPrimitives

  constructor(initial: PlayerStats = PlayerStats.empty()) {
    this.stored = initial.toPrimitives()
  }

  find(): PlayerStats {
    return PlayerStats.fromPrimitives(this.stored)
  }

  save(stats: PlayerStats): void {
    this.stored = stats.toPrimitives()
  }
}
