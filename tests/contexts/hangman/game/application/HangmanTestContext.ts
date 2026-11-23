import { GetCurrentGame } from '@/contexts/hangman/game/application/GetCurrentGame/GetCurrentGame'
import { GuessLetter } from '@/contexts/hangman/game/application/GuessLetter/GuessLetter'
import { SolvePhrase } from '@/contexts/hangman/game/application/SolvePhrase/SolvePhrase'
import { StartGame } from '@/contexts/hangman/game/application/StartGame/StartGame'
import { InMemoryGameRepository } from '@/contexts/hangman/game/infrastructure/InMemoryGameRepository/InMemoryGameRepository'
import { PhrasePicker } from '@/contexts/hangman/phrase/domain/PhrasePicker/PhrasePicker'
import { InMemoryPhraseRepository } from '@/contexts/hangman/phrase/infrastructure/InMemoryPhraseRepository/InMemoryPhraseRepository'
import { RecordGameResult } from '@/contexts/hangman/stats/application/RecordGameResult/RecordGameResult'
import { InMemoryPlayerStatsRepository } from '../../stats/infrastructure/InMemoryPlayerStatsRepository/InMemoryPlayerStatsRepository'

/** Casos de uso de la partida conectados a repositorios en memoria y una frase fija. */
export class HangmanTestContext {
  readonly games = new InMemoryGameRepository()
  readonly stats = new InMemoryPlayerStatsRepository()
  readonly startGame: StartGame
  readonly getCurrentGame = new GetCurrentGame(this.games)
  readonly guessLetter: GuessLetter
  readonly solvePhrase: SolvePhrase

  constructor(phrase: string = 'Ver para creer') {
    const recordGameResult = new RecordGameResult(this.stats)
    this.startGame = new StartGame(this.games, new PhrasePicker(new InMemoryPhraseRepository([phrase]), { next: () => 0 }))
    this.guessLetter = new GuessLetter(this.games, recordGameResult)
    this.solvePhrase = new SolvePhrase(this.games, recordGameResult)
  }

  guessAll(letters: string): void {
    for (const letter of letters) this.guessLetter.execute(letter)
  }
}
