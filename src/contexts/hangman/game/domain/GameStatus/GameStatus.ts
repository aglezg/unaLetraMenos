export type GameStatusValue = 'playing' | 'won' | 'lost'

export class GameStatus {
  private constructor(readonly value: GameStatusValue) {}

  static playing(): GameStatus {
    return new GameStatus('playing')
  }

  static won(): GameStatus {
    return new GameStatus('won')
  }

  static lost(): GameStatus {
    return new GameStatus('lost')
  }

  static fromPrimitives(value: GameStatusValue): GameStatus {
    return new GameStatus(value)
  }

  isPlaying(): boolean {
    return this.value === 'playing'
  }

  isFinished(): boolean {
    return !this.isPlaying()
  }
}
