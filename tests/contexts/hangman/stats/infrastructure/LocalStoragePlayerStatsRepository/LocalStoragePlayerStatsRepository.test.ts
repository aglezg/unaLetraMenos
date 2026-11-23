import { afterEach, describe, expect, test, vi } from 'vitest'
import { LocalStoragePlayerStatsRepository } from '@/contexts/hangman/stats/infrastructure/LocalStoragePlayerStatsRepository/LocalStoragePlayerStatsRepository'
import { PlayerStatsMother } from '../../domain/PlayerStats/PlayerStatsMother'

describe('LocalStoragePlayerStatsRepository', () => {
  const repository = new LocalStoragePlayerStatsRepository()

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('mantiene la clave del MVP', () => {
    expect(LocalStoragePlayerStatsRepository.KEY).toBe('meLaCompletas:stats')
  })

  test('sin datos guardados empieza en 0', () => {
    expect(repository.find().toPrimitives()).toEqual({ streak: 0, record: 0 })
  })

  test('recupera lo guardado', () => {
    repository.save(PlayerStatsMother.with(2, 4))
    expect(repository.find().toPrimitives()).toEqual({ streak: 2, record: 4 })
    expect(JSON.parse(localStorage.getItem(LocalStoragePlayerStatsRepository.KEY)!)).toEqual({ streak: 2, record: 4 })
  })

  test.each(['no es json', '{"streak":-1,"record":2}', '{"streak":"2","record":4}', '{"streak":5,"record":2}', 'null'])(
    'datos no válidos (%s) empiezan en 0',
    (raw) => {
      localStorage.setItem(LocalStoragePlayerStatsRepository.KEY, raw)
      expect(repository.find().toPrimitives()).toEqual({ streak: 0, record: 0 })
    },
  )

  test('si el almacenamiento falla, no rompe el juego', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    expect(repository.find().toPrimitives()).toEqual({ streak: 0, record: 0 })
    expect(() => repository.save(PlayerStatsMother.with(1))).not.toThrow()
  })
})
