import { describe, expect, test } from 'vitest'
import { GetPlayerStats } from '@/contexts/hangman/stats/application/GetPlayerStats/GetPlayerStats'
import { PlayerStatsMother } from '../../domain/PlayerStats/PlayerStatsMother'
import { InMemoryPlayerStatsRepository } from '../../infrastructure/InMemoryPlayerStatsRepository/InMemoryPlayerStatsRepository'

describe('GetPlayerStats', () => {
  test('devuelve las estadísticas guardadas', () => {
    const useCase = new GetPlayerStats(new InMemoryPlayerStatsRepository(PlayerStatsMother.with(2, 4)))
    expect(useCase.execute()).toEqual({ streak: 2, record: 4 })
  })
})
