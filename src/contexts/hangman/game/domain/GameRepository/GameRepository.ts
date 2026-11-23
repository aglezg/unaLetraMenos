import type { Game } from '@/contexts/hangman/game/domain/Game/Game'

/** Guarda la partida en curso: solo hay una por jugador. */
export interface GameRepository {
  save(game: Game): void
  current(): Game | null
}
