import type { PhraseRepository } from '@/contexts/hangman/phrase/domain/PhraseRepository/PhraseRepository'
import { SPANISH_PROVERBS } from '@/contexts/hangman/phrase/infrastructure/InMemoryPhraseRepository/spanishProverbs'

export class InMemoryPhraseRepository implements PhraseRepository {
  constructor(private readonly phrases: readonly string[] = SPANISH_PROVERBS) {}

  all(): readonly string[] {
    return this.phrases
  }
}
