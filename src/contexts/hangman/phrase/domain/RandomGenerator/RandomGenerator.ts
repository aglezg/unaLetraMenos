export interface RandomGenerator {
  /** Número en el intervalo [0, 1). */
  next(): number
}
