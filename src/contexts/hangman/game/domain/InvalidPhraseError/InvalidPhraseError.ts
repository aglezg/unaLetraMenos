export class InvalidPhraseError extends Error {
  constructor(value: string) {
    super(`"${value}" no contiene ninguna letra`)
    this.name = 'InvalidPhraseError'
  }
}
