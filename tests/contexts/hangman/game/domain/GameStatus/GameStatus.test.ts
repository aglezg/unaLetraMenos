import { describe, expect, test } from 'vitest'
import { GameStatus } from '@/contexts/hangman/game/domain/GameStatus/GameStatus'

describe('GameStatus', () => {
  test('una partida en juego no está terminada', () => {
    expect(GameStatus.playing().isPlaying()).toBe(true)
    expect(GameStatus.playing().isFinished()).toBe(false)
  })

  test.each([GameStatus.won(), GameStatus.lost()])('$value es un estado final', (status) => {
    expect(status.isFinished()).toBe(true)
  })

  test('se reconstruye desde su valor', () => {
    expect(GameStatus.fromPrimitives('lost').value).toBe('lost')
  })
})
