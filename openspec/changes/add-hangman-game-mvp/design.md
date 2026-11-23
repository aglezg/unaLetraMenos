# Design

## Context

Proyecto vacío (solo existe `openspec/`). Entorno disponible: Node 20 y pnpm. Ver proposal.md para la motivación y los specs (`phrase-catalog`, `hangman-gameplay`, `game-stats`) para el comportamiento exigido. La intención es iterar y refactorizar sobre este MVP, así que la estructura debe facilitar cambios (por ejemplo, sustituir el contador de vidas por un dibujo).

## Goals / Non-Goals

**Goals:**
- Lógica del juego en TypeScript puro, sin React, testeable con Vitest.
- UI en React que solo traduce el estado a pantalla y los clics a acciones.
- Componentes pequeños y sustituibles (tablero, teclado, vidas, carteles, contadores).

**Non-Goals:**
- Router, gestor de estado externo (Redux, Zustand…), librería de componentes o CSS framework.
- Tests end-to-end en navegador; basta con tests de lógica y de componentes clave.
- Despliegue.

## Decisions

### 1. Stack: Vite + React + TypeScript + Vitest
Scaffolding con `pnpm create vite` (plantilla `react-ts`) en la raíz del repo, conviviendo con `openspec/`. Vitest para tests porque comparte la configuración de Vite; Testing Library + jsdom para tests de componentes.
- Alternativa: Jest → requiere configuración extra para TS/ESM; descartado.

El registro global de pnpm en esta máquina apunta a un Artifactory corporativo que devuelve 403 para paquetes públicos. Se añade un `.npmrc` en la raíz del proyecto con `registry=https://registry.npmjs.org/` para que las instalaciones de este proyecto usen el registro público sin tocar la configuración global.

### 2. Lógica separada como funciones puras + reducer
Módulo `src/game/` con:
- `normalize.ts`: `normalizeLetter` y `normalizePhrase` (minúsculas, quitar tildes/diéresis con `NFD` preservando la ñ, quitar puntuación, colapsar espacios).
- `phrases.ts`: el array de 100 refranes.
- `phrasePicker.ts`: selector sin repetición (baraja de índices restantes; al vaciarse se rellena). Recibe una función `random` inyectable para tests deterministas.
- `gameReducer.ts`: estado `{ phrase, guessedLetters, lives, status: 'playing' | 'won' | 'lost' }` y acciones `GUESS_LETTER`, `SOLVE`, `NEW_GAME`. Las reglas (aciertos, fallos, letras repetidas, partida terminada) viven aquí.
- `stats.ts`: `applyResult(stats, 'won' | 'lost')` puro + `loadStats` / `saveStats` sobre `localStorage` con `try/catch` y validación.

React usa `useReducer(gameReducer)`. Por qué: las reglas quedan testeables sin renderizar nada y la UI se puede rehacer sin tocar la lógica.
- Alternativa: estado con varios `useState` en componentes → reglas dispersas y difíciles de testear; descartado.

### 3. Normalización de la Ñ
`NFD` descompone la ñ en `n` + tilde combinante, así que una normalización ingenua la convertiría en `n`. Se protege la ñ antes de quitar diacríticos (reemplazo temporal o eliminar solo `́` agudo y `̈` diéresis, no `̃`). Hay tests específicos para "año" vs N.

### 4. Qué es una "letra" en la frase
Un carácter cuenta como letra si, normalizado, está en `a–z` o es `ñ`. Todo lo demás (espacios, comas, puntos, `¿?¡!`) no se adivina y se muestra tal cual. La victoria se calcula comprobando que todas las letras normalizadas de la frase están en `guessedLetters`.

### 5. Estadísticas y su ciclo de vida
Las stats viven en un hook `useStats` independiente del reducer: al pasar `status` a `won`/`lost` se aplica `applyResult` una sola vez por partida y se guarda. Clave de `localStorage`: `meLaCompletas:stats` con `{ streak, record }`. Datos corruptos → `{ 0, 0 }`.
- Alternativa: meter stats en el reducer de la partida → mezcla ciclo de vida de partida y de sesión; descartado.

### 6. Selector de frases fuera del reducer
El picker se crea una vez por carga de página (estado en memoria, no persistido) y la acción `NEW_GAME` recibe la frase ya elegida. Así el reducer sigue siendo puro.

### 7. Estilos
CSS plano por componente (un `App.css` o CSS modules). Verde/rojo para teclas usadas, cuadrados con borde para letras. Diseño responsive básico para que el teclado sea usable en móvil.

### Estructura prevista

```
src/
  game/        normalize, phrases, phrasePicker, gameReducer, stats (+ *.test.ts)
  components/  Board, Keyboard, LivesCounter, SolveForm, ResultModal, StatsBar
  hooks/       useStats
  App.tsx      compone todo
```

## Risks / Trade-offs

- [Refranes escritos a mano con longitudes incorrectas o duplicados] → test que valida 100 frases, únicas, 20–60 caracteres y caracteres permitidos.
- [Frases de hasta 60 caracteres ocupan varias líneas, sobre todo en móvil] → el tablero ya salta de línea por palabras; comprobar a 390 px de ancho que ninguna palabra se corta ni provoca scroll horizontal.
- [Ñ convertida en N por la normalización] → tests dedicados (decisión 3).
- [Recargar a mitad de partida evita perder la racha] → aceptado en el MVP (spec `game-stats`); se puede revisar más adelante persistiendo la partida en curso.
- [Stats aplicadas dos veces por re-render o StrictMode] → aplicar el resultado en el mismo punto que la transición de estado o con un id de partida que evite dobles aplicaciones; cubrir con test del hook/App.
