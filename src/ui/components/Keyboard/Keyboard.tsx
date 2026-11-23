import styles from './Keyboard.module.css'

interface Key {
  label: string
  status: 'unused' | 'hit' | 'miss'
}

interface KeyboardProps {
  keys: readonly Key[]
  disabled: boolean
  onGuess: (letter: string) => void
}

export function Keyboard({ keys, disabled, onGuess }: KeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {keys.map(({ label, status }) => (
        <button
          type="button"
          key={label}
          className={`${styles.key} ${styles[status]}`}
          data-status={status}
          disabled={disabled || status !== 'unused'}
          onClick={() => onGuess(label)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
