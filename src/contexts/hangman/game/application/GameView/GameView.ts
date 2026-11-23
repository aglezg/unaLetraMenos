import type { GameStatusValue } from '@/contexts/hangman/game/domain/GameStatus/GameStatus'
import type { LetterStatus } from '@/contexts/hangman/game/domain/LetterStatus/LetterStatus'

/** Letra de la frase (vacía mientras está oculta) o símbolo siempre visible. */
export interface CellView {
  readonly kind: 'letter' | 'symbol'
  readonly value: string
}

export interface KeyView {
  readonly label: string
  readonly status: LetterStatus
}

export interface GameView {
  readonly words: readonly (readonly CellView[])[]
  readonly keys: readonly KeyView[]
  readonly lives: number
  readonly status: GameStatusValue
  /** Frase completa, solo cuando la partida ha terminado. */
  readonly solution: string | null
}
