import styles from './ResultModal.module.css'

interface ResultModalProps {
  status: 'playing' | 'won' | 'lost'
  solution: string | null
  onNewGame: () => void
}

export function ResultModal({ status, solution, onNewGame }: ResultModalProps) {
  if (status === 'playing') return null
  const won = status === 'won'

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${won ? styles.won : styles.lost}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <h2 className={styles.title} id="result-title">
          {won ? '¡Enhorabuena!' : 'Has perdido'}
        </h2>
        <p>
          {won ? 'Has adivinado la frase:' : 'La frase era:'} <strong>{solution}</strong>
        </p>
        <button className={styles.button} type="button" onClick={onNewGame} autoFocus>
          {won ? 'Otra partida' : 'Reintentar'}
        </button>
      </div>
    </div>
  )
}
