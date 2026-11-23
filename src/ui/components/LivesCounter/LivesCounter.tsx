import styles from './LivesCounter.module.css'

interface LivesCounterProps {
  lives: number
}

export function LivesCounter({ lives }: LivesCounterProps) {
  return <p className={styles.lives}>Intentos restantes: {lives}</p>
}
