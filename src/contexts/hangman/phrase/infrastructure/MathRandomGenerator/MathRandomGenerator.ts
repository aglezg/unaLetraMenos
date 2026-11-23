import type { RandomGenerator } from '@/contexts/hangman/phrase/domain/RandomGenerator/RandomGenerator'

export class MathRandomGenerator implements RandomGenerator {
  next(): number {
    return Math.random()
  }
}
