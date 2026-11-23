import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LivesCounter } from '@/ui/components/LivesCounter/LivesCounter'

describe('LivesCounter', () => {
  test('muestra las vidas restantes', () => {
    render(<LivesCounter lives={4} />)
    expect(screen.getByText('Intentos restantes: 4')).toBeInTheDocument()
  })
})
