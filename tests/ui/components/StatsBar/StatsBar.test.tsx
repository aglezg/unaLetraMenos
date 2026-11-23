import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsBar } from '@/ui/components/StatsBar/StatsBar'

describe('StatsBar', () => {
  test('muestra victorias y récord', () => {
    render(<StatsBar streak={2} record={4} />)
    expect(screen.getByText('Victorias: 2')).toBeInTheDocument()
    expect(screen.getByText('Record: 4')).toBeInTheDocument()
  })
})
