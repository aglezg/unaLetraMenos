import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Board } from '@/ui/components/Board/Board'

const letter = (value = '') => ({ kind: 'letter' as const, value })
const symbol = (value: string) => ({ kind: 'symbol' as const, value })

describe('Board', () => {
  test('pinta un cuadrado por letra agrupado por palabras y los símbolos visibles', () => {
    render(<Board words={[[letter(), letter('Á'), letter()], [letter(), letter(), symbol(',')]]} />)
    expect(screen.getAllByTestId('word')).toHaveLength(2)
    expect(screen.getAllByTestId('cell').map((cell) => cell.textContent)).toEqual(['', 'Á', '', '', ''])
    expect(screen.getByTestId('symbol')).toHaveTextContent(',')
  })
})
