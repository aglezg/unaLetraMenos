import { useState } from 'react'
import type { GameView } from '@/contexts/hangman/game/application/GameView/GameView'
import { GameNotStartedError } from '@/contexts/hangman/game/domain/GameNotStartedError/GameNotStartedError'
import type { PlayerStatsView } from '@/contexts/hangman/stats/application/PlayerStatsView/PlayerStatsView'
import type { HangmanContainer } from '@/ui/container/HangmanContainer/HangmanContainer'
import { useHangmanContainer } from '@/ui/context/HangmanContext/HangmanContext'

export interface HangmanGame {
  game: GameView
  stats: PlayerStatsView
  guess: (letter: string) => void
  solve: (attempt: string) => void
  newGame: () => void
}

// Reutiliza la partida en curso si existe: StrictMode ejecuta dos veces el
// inicializador de useState y así no se crean dos partidas distintas.
function currentOrNewGame(container: HangmanContainer): GameView {
  try {
    return container.getCurrentGame.execute()
  } catch (error) {
    if (error instanceof GameNotStartedError) return container.startGame.execute()
    throw error
  }
}

/** Único punto de contacto entre React y los casos de uso del ahorcado. */
export function useHangmanGame(): HangmanGame {
  const container = useHangmanContainer()
  const [game, setGame] = useState(() => currentOrNewGame(container))
  const [stats, setStats] = useState(() => container.getPlayerStats.execute())

  function update(view: GameView) {
    setGame(view)
    setStats(container.getPlayerStats.execute())
  }

  return {
    game,
    stats,
    guess: (letter) => update(container.guessLetter.execute(letter)),
    solve: (attempt) => update(container.solvePhrase.execute(attempt)),
    newGame: () => update(container.startGame.execute()),
  }
}
