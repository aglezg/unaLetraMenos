import { InvalidLivesError } from '@/contexts/hangman/game/domain/InvalidLivesError/InvalidLivesError'

export class Lives {
  static readonly MAX = 6

  private constructor(readonly value: number) {}

  static initial(): Lives {
    return new Lives(Lives.MAX)
  }

  static fromPrimitives(value: number): Lives {
    if (!Number.isInteger(value) || value < 0 || value > Lives.MAX) throw new InvalidLivesError(value)
    return new Lives(value)
  }

  lose(): Lives {
    return new Lives(Math.max(this.value - 1, 0))
  }

  isExhausted(): boolean {
    return this.value === 0
  }
}
