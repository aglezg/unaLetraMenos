import { createContext, useContext } from 'react'
import type { HangmanContainer } from '@/ui/container/HangmanContainer/HangmanContainer'

export const HangmanContext = createContext<HangmanContainer | null>(null)

export function useHangmanContainer(): HangmanContainer {
  const container = useContext(HangmanContext)
  if (!container) throw new Error('useHangmanContainer debe usarse dentro de <HangmanProvider>')
  return container
}
