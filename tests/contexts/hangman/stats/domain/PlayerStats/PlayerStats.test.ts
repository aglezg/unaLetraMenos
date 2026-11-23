import { describe, expect, test } from 'vitest'
import { InvalidPlayerStatsError } from '@/contexts/hangman/stats/domain/InvalidPlayerStatsError/InvalidPlayerStatsError'
import { PlayerStats } from '@/contexts/hangman/stats/domain/PlayerStats/PlayerStats'
import { PlayerStatsMother } from './PlayerStatsMother'

describe('PlayerStats', () => {
  test('empieza en 0', () => {
    expect(PlayerStats.empty().toPrimitives()).toEqual({ streak: 0, record: 0 })
  })

  test('ganar suma 1 a la racha', () => {
    const stats = PlayerStatsMother.with(2, 5)
    stats.recordWin()
    expect(stats.toPrimitives()).toEqual({ streak: 3, record: 5 })
  })

  test('perder pone la racha a 0 sin tocar el récord', () => {
    const stats = PlayerStatsMother.with(3)
    stats.recordLoss()
    expect(stats.toPrimitives()).toEqual({ streak: 0, record: 3 })
  })

  test('gana, gana, gana, pierde, gana deja racha 1 y récord 3', () => {
    const stats = PlayerStatsMother.empty()
    stats.recordWin()
    stats.recordWin()
    stats.recordWin()
    stats.recordLoss()
    stats.recordWin()
    expect(stats.toPrimitives()).toEqual({ streak: 1, record: 3 })
  })

  test.each([
    { streak: -1, record: 2 },
    { streak: 1.5, record: 2 },
    { streak: 5, record: 2 },
    { streak: '2', record: 4 },
  ])('no acepta datos no válidos: %o', (primitives) => {
    expect(() => PlayerStats.fromPrimitives(primitives as never)).toThrow(InvalidPlayerStatsError)
  })
})
