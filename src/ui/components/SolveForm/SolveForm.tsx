import { useState, type FormEvent } from 'react'
import styles from './SolveForm.module.css'

interface SolveFormProps {
  disabled: boolean
  onSolve: (attempt: string) => void
}

export function SolveForm({ disabled, onSolve }: SolveFormProps) {
  const [attempt, setAttempt] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSolve(attempt)
    setAttempt('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        aria-label="Resolver frase"
        placeholder="Escribe la frase completa"
        value={attempt}
        disabled={disabled}
        onChange={(event) => setAttempt(event.target.value)}
      />
      <button className={styles.button} type="submit" disabled={disabled}>
        Probar
      </button>
    </form>
  )
}
