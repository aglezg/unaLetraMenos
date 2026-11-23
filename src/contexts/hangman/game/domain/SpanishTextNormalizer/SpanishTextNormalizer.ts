// Quita tildes y diéresis pero conserva la virgulilla de la ñ (U+0303),
// para que la ñ no se convierta en n al descomponer con NFD.
const DIACRITICS_EXCEPT_TILDE = /[̀-̂̄-ͯ]/g

export class SpanishTextNormalizer {
  static normalize(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(DIACRITICS_EXCEPT_TILDE, '').normalize('NFC')
  }

  static normalizeSentence(text: string): string {
    return SpanishTextNormalizer.normalize(text)
      .replace(/[^a-zñ\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
}
