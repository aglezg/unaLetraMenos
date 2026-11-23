import { Board } from '@/ui/components/Board/Board'
import { Keyboard } from '@/ui/components/Keyboard/Keyboard'
import { LivesCounter } from '@/ui/components/LivesCounter/LivesCounter'
import { ResultModal } from '@/ui/components/ResultModal/ResultModal'
import { SolveForm } from '@/ui/components/SolveForm/SolveForm'
import { StatsBar } from '@/ui/components/StatsBar/StatsBar'
import { useHangmanGame } from '@/ui/hooks/useHangmanGame/useHangmanGame'
import styles from './GamePage.module.css'

export function GamePage() {
  const { game, stats, guess, solve, newGame } = useHangmanGame()
  const finished = game.status !== 'playing'

  return (
    <div className={styles.page}>
      <main className={styles.game}>
        <h1 className={styles.title}>Ahorcado</h1>
        <Board words={game.words} />
        <LivesCounter lives={game.lives} />
        <Keyboard keys={game.keys} disabled={finished} onGuess={guess} />
        <SolveForm disabled={finished} onSolve={solve} />
      </main>
      <StatsBar streak={stats.streak} record={stats.record} />
      <ResultModal status={game.status} solution={game.solution} onNewGame={newGame} />
    </div>
  )
}
