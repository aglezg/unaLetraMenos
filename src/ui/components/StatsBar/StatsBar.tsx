import styles from './StatsBar.module.css'

interface StatsBarProps {
  streak: number
  record: number
}

export function StatsBar({ streak, record }: StatsBarProps) {
  return (
    <footer className={styles.stats}>
      <span>Victorias: {streak}</span>
      <span>Record: {record}</span>
    </footer>
  )
}
