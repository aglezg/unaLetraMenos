import styles from './Board.module.css'

interface Cell {
  kind: 'letter' | 'symbol'
  value: string
}

interface BoardProps {
  words: readonly (readonly Cell[])[]
}

export function Board({ words }: BoardProps) {
  return (
    <div className={styles.board} aria-label="Frase">
      {words.map((word, wordIndex) => (
        <span className={styles.word} data-testid="word" key={wordIndex}>
          {word.map((cell, cellIndex) =>
            cell.kind === 'letter' ? (
              <span className={styles.cell} data-testid="cell" key={cellIndex}>
                {cell.value}
              </span>
            ) : (
              <span className={styles.symbol} data-testid="symbol" key={cellIndex}>
                {cell.value}
              </span>
            ),
          )}
        </span>
      ))}
    </div>
  )
}
