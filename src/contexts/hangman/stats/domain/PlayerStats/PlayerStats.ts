import { InvalidPlayerStatsError } from '@/contexts/hangman/stats/domain/InvalidPlayerStatsError/InvalidPlayerStatsError'

export interface PlayerStatsPrimitives {
  streak: number
  record: number
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

/** Racha de victorias seguidas y mejor racha conseguida. */
export class PlayerStats {
  private constructor(
    private streak: number,
    private record: number,
  ) {}

  static empty(): PlayerStats {
    return new PlayerStats(0, 0)
  }

  static fromPrimitives({ streak, record }: PlayerStatsPrimitives): PlayerStats {
    if (!isCount(streak) || !isCount(record) || streak > record) throw new InvalidPlayerStatsError(streak, record)
    return new PlayerStats(streak, record)
  }

  recordWin(): void {
    this.streak += 1
    this.record = Math.max(this.record, this.streak)
  }

  recordLoss(): void {
    this.streak = 0
  }

  toPrimitives(): PlayerStatsPrimitives {
    return { streak: this.streak, record: this.record }
  }
}
