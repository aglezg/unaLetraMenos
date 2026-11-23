import type { PlayerStats } from '@/contexts/hangman/stats/domain/PlayerStats/PlayerStats'

export interface PlayerStatsRepository {
  save(stats: PlayerStats): void
  find(): PlayerStats
}
