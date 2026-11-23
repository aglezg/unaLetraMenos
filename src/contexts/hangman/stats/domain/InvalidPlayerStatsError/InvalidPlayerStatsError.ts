export class InvalidPlayerStatsError extends Error {
  constructor(streak: unknown, record: unknown) {
    super(`Estadísticas no válidas: racha ${String(streak)}, récord ${String(record)}`)
    this.name = 'InvalidPlayerStatsError'
  }
}
