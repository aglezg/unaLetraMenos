export class InvalidLivesError extends Error {
  constructor(value: number) {
    super(`${value} no es un número de vidas válido`)
    this.name = 'InvalidLivesError'
  }
}
