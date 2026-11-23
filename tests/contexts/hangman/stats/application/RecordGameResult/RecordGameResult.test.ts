import { describe, expect, test } from 'vitest'
import { RecordGameResult } from '@/contexts/hangman/stats/application/RecordGameResult/RecordGameResult'
import { PlayerStatsMother } from '../../domain/PlayerStats/PlayerStatsMother'
import { InMemoryPlayerStatsRepository } from '../../infrastructure/InMemoryPlayerStatsRepository/InMemoryPlayerStatsRepository'

describe('RecordGameResult', () => {
  test('una victoria suma a la racha y se guarda', () => {
    const repository = new InMemoryPlayerStatsRepository(PlayerStatsMother.with(2))
    expect(new RecordGameResult(repository).execute('won')).toEqual({ streak: 3, record: 3 })
    expect(repository.find().toPrimitives()).toEqual({ streak: 3, record: 3 })
  })

  test('una derrota pone la racha a 0 y se guarda', () => {
    const repository = new InMemoryPlayerStatsRepository(PlayerStatsMother.with(3))
    expect(new RecordGameResult(repository).execute('lost')).toEqual({ streak: 0, record: 3 })
    expect(repository.find().toPrimitives()).toEqual({ streak: 0, record: 3 })
  })
})
