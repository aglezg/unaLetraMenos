import { describe, expect, test } from 'vitest'
import { Letter } from '@/contexts/hangman/game/domain/Letter/Letter'
import { InMemoryGameRepository } from '@/contexts/hangman/game/infrastructure/InMemoryGameRepository/InMemoryGameRepository'
import { GameMother } from '../../domain/Game/GameMother'

describe('InMemoryGameRepository', () => {
  test('no hay partida hasta guardar una', () => {
    expect(new InMemoryGameRepository().current()).toBeNull()
  })

  test('devuelve la última partida guardada', () => {
    const repository = new InMemoryGameRepository()
    const game = GameMother.start()
    repository.save(game)
    expect(repository.current()?.toPrimitives()).toEqual(game.toPrimitives())
  })

  test('los cambios no guardados no afectan a la partida almacenada', () => {
    const repository = new InMemoryGameRepository()
    repository.save(GameMother.start())
    repository.current()?.guess(Letter.from('z'))
    expect(repository.current()?.toPrimitives().lives).toBe(6)
  })
})
