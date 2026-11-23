import { PlayerStats } from '@/contexts/hangman/stats/domain/PlayerStats/PlayerStats'
import type { PlayerStatsRepository } from '@/contexts/hangman/stats/domain/PlayerStatsRepository/PlayerStatsRepository'

export class LocalStoragePlayerStatsRepository implements PlayerStatsRepository {
  static readonly KEY = 'meLaCompletas:stats'

  /** Datos ausentes, corruptos o almacenamiento bloqueado: se empieza de cero sin impedir jugar. */
  find(): PlayerStats {
    try {
      const raw = localStorage.getItem(LocalStoragePlayerStatsRepository.KEY)
      return raw === null ? PlayerStats.empty() : PlayerStats.fromPrimitives(JSON.parse(raw))
    } catch {
      return PlayerStats.empty()
    }
  }

  save(stats: PlayerStats): void {
    try {
      localStorage.setItem(LocalStoragePlayerStatsRepository.KEY, JSON.stringify(stats.toPrimitives()))
    } catch {
      // Sin almacenamiento disponible: el juego sigue funcionando sin persistir.
    }
  }
}
