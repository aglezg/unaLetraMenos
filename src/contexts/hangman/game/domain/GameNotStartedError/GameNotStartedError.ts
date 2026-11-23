export class GameNotStartedError extends Error {
  constructor() {
    super('No hay ninguna partida en curso')
    this.name = 'GameNotStartedError'
  }
}
