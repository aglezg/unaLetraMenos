import type { PhraseRepository } from '@/contexts/hangman/phrase/domain/PhraseRepository/PhraseRepository'
import type { RandomGenerator } from '@/contexts/hangman/phrase/domain/RandomGenerator/RandomGenerator'

export class PhrasePicker {
  private remaining: string[] = []

  constructor(
    private readonly repository: PhraseRepository,
    private readonly random: RandomGenerator,
  ) {}

  pick(): string {
    if (this.remaining.length === 0) this.remaining = [...this.repository.all()]
    const index = Math.floor(this.random.next() * this.remaining.length)
    const [phrase] = this.remaining.splice(index, 1)
    return phrase
  }
}
