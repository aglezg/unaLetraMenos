import type { ReactNode } from 'react'
import type { HangmanContainer } from '@/ui/container/HangmanContainer/HangmanContainer'
import { HangmanContext } from '@/ui/context/HangmanContext/HangmanContext'

interface HangmanProviderProps {
  container: HangmanContainer
  children: ReactNode
}

export function HangmanProvider({ container, children }: HangmanProviderProps) {
  return <HangmanContext.Provider value={container}>{children}</HangmanContext.Provider>
}
