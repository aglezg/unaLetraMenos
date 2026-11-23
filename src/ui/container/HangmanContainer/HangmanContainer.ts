import { GetCurrentGame } from '@/contexts/hangman/game/application/GetCurrentGame/GetCurrentGame'
import { GuessLetter } from '@/contexts/hangman/game/application/GuessLetter/GuessLetter'
import { SolvePhrase } from '@/contexts/hangman/game/application/SolvePhrase/SolvePhrase'
import { StartGame } from '@/contexts/hangman/game/application/StartGame/StartGame'
import { InMemoryGameRepository } from '@/contexts/hangman/game/infrastructure/InMemoryGameRepository/InMemoryGameRepository'
import { PhrasePicker } from '@/contexts/hangman/phrase/domain/PhrasePicker/PhrasePicker'
import { InMemoryPhraseRepository } from '@/contexts/hangman/phrase/infrastructure/InMemoryPhraseRepository/InMemoryPhraseRepository'
import { SPANISH_PROVERBS } from '@/contexts/hangman/phrase/infrastructure/InMemoryPhraseRepository/spanishProverbs'
import { MathRandomGenerator } from '@/contexts/hangman/phrase/infrastructure/MathRandomGenerator/MathRandomGenerator'
import { GetPlayerStats } from '@/contexts/hangman/stats/application/GetPlayerStats/GetPlayerStats'
import { RecordGameResult } from '@/contexts/hangman/stats/application/RecordGameResult/RecordGameResult'
import { LocalStoragePlayerStatsRepository } from '@/contexts/hangman/stats/infrastructure/LocalStoragePlayerStatsRepository/LocalStoragePlayerStatsRepository'

/** Composition root: único sitio que conoce las implementaciones concretas. */
export class HangmanContainer {
  readonly startGame: StartGame
  readonly getCurrentGame: GetCurrentGame
  readonly guessLetter: GuessLetter
  readonly solvePhrase: SolvePhrase
  readonly getPlayerStats: GetPlayerStats

  constructor(phrases: readonly string[] = SPANISH_PROVERBS) {
    const games = new InMemoryGameRepository()
    const stats = new LocalStoragePlayerStatsRepository()
    const recordGameResult = new RecordGameResult(stats)
    const phrasePicker = new PhrasePicker(new InMemoryPhraseRepository(phrases), new MathRandomGenerator())

    this.startGame = new StartGame(games, phrasePicker)
    this.getCurrentGame = new GetCurrentGame(games)
    this.guessLetter = new GuessLetter(games, recordGameResult)
    this.solvePhrase = new SolvePhrase(games, recordGameResult)
    this.getPlayerStats = new GetPlayerStats(stats)
  }
}
