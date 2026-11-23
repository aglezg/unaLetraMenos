import { PlayerStats } from '@/contexts/hangman/stats/domain/PlayerStats/PlayerStats'

export class PlayerStatsMother {
  static empty(): PlayerStats {
    return PlayerStats.empty()
  }

  static with(streak: number, record: number = streak): PlayerStats {
    return PlayerStats.fromPrimitives({ streak, record })
  }
}
