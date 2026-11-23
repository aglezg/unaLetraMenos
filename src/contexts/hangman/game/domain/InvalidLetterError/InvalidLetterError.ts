export class InvalidLetterError extends Error {
  constructor(value: string) {
    super(`"${value}" no es una letra del alfabeto español`)
    this.name = 'InvalidLetterError'
  }
}
