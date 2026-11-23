import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HangmanContainer } from '@/ui/container/HangmanContainer/HangmanContainer'
import { HangmanProvider } from '@/ui/context/HangmanProvider/HangmanProvider'
import { GamePage } from '@/ui/pages/GamePage/GamePage'
import '@/ui/styles/global.css'

const container = new HangmanContainer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HangmanProvider container={container}>
      <GamePage />
    </HangmanProvider>
  </StrictMode>,
)
