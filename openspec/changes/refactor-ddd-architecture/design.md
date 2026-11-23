# Design

## Context

Ver proposal.md (Why). El comportamiento lo fijan las specs del MVP (`phrase-catalog`, `hangman-gameplay`, `game-stats`) y no cambia.

Estado actual:
- `src/game/`: funciones puras (`normalize`, `gameReducer`, `phrasePicker`, `stats`) y el array `PHRASES`.
- `src/hooks/useStats.ts`: decide en React cuándo contar una victoria/derrota, con una `ref` para no contar dos veces.
- `src/components/`: componentes React que importan directamente funciones de dominio (`isRevealed`, `letterStatus`).
- Un único `src/index.css` con todos los estilos.
- Tests `*.test.ts(x)` al lado de cada archivo.
- `tsconfig.app.json` tiene `erasableSyntaxOnly: true`, que prohíbe las propiedades de parámetro en el constructor (`constructor(private readonly x: X)`).

## Goals / Non-Goals

**Goals:**
- Dominio orientado a objetos y aislado de React y del navegador.
- Una carpeta por clase/componente y capas explícitas.
- Tests en `tests/`, con la misma estructura que `src/`.
- Que React solo pinte datos y llame a casos de uso.

**Non-Goals:**
- Cambiar comportamiento, textos o estilos visibles.
- Añadir librerías (contenedor de inyección de dependencias, gestor de estado, router…).
- Bus de eventos de dominio: con un solo consumidor, el caso de uso llama directamente a las estadísticas (ver decisión 4).

## Decisions

### 1. Estructura de carpetas

```
src/
  contexts/
    hangman/                                  <- bounded context
      game/
        domain/
          Game/Game.ts                        <- agregado raíz de la partida
          Letter/Letter.ts                    <- VO: una letra normalizada (tildes, ñ)
          Phrase/Phrase.ts                    <- VO: frase, sus letras y comparación normalizada
          Lives/Lives.ts                      <- VO: vidas (6 → 0)
          GameStatus/GameStatus.ts            <- playing | won | lost
          Alphabet/Alphabet.ts                <- las 27 letras del teclado
          GameRepository/GameRepository.ts    <- interfaz: partida en curso
        application/
          StartGame/StartGame.ts
          GuessLetter/GuessLetter.ts
          SolvePhrase/SolvePhrase.ts
          GetCurrentGame/GetCurrentGame.ts
          GameView/GameView.ts                <- DTO de solo lectura para la UI
        infrastructure/
          InMemoryGameRepository/InMemoryGameRepository.ts
      phrase/
        domain/
          PhraseRepository/PhraseRepository.ts
          PhrasePicker/PhrasePicker.ts        <- elige sin repetir hasta agotar
          RandomGenerator/RandomGenerator.ts  <- interfaz para poder fijar el azar en tests
        infrastructure/
          InMemoryPhraseRepository/InMemoryPhraseRepository.ts
          InMemoryPhraseRepository/spanishProverbs.ts
          MathRandomGenerator/MathRandomGenerator.ts
      stats/
        domain/
          PlayerStats/PlayerStats.ts          <- agregado: racha y récord
          PlayerStatsRepository/PlayerStatsRepository.ts
        application/
          GetPlayerStats/GetPlayerStats.ts
          RecordGameResult/RecordGameResult.ts
          PlayerStatsView/PlayerStatsView.ts
        infrastructure/
          LocalStoragePlayerStatsRepository/LocalStoragePlayerStatsRepository.ts
  ui/
    main.tsx                                  <- arranque de React
    container/container.ts                    <- construye repositorios y casos de uso
    context/HangmanContext/HangmanContext.tsx <- entrega los casos de uso a React
    hooks/useHangmanGame/useHangmanGame.ts    <- puente casos de uso ↔ estado de React
    pages/GamePage/GamePage.tsx (+ .module.css)
    components/
      Board/Board.tsx + Board.module.css
      Keyboard/Keyboard.tsx + Keyboard.module.css
      LivesCounter/LivesCounter.tsx + .module.css
      SolveForm/SolveForm.tsx + .module.css
      ResultModal/ResultModal.tsx + .module.css
      StatsBar/StatsBar.tsx + .module.css
    styles/global.css                         <- variables de color, reset y body

tests/                                        <- misma estructura que src/
  contexts/hangman/game/domain/Game/Game.test.ts
  contexts/hangman/game/domain/Game/GameMother.ts
  ...
  ui/components/Board/Board.test.tsx
  ui/pages/GamePage/GamePage.test.tsx
  setup.ts
```

Módulos alineados con las specs: `game` ↔ `hangman-gameplay`, `phrase` ↔ `phrase-catalog`, `stats` ↔ `game-stats`. `index.html` apunta a `src/ui/main.tsx`.

- Alternativa: organizar solo por capas (`src/domain`, `src/application`…) → mezcla módulos y escala peor; descartado.

### 2. Dominio con clases, entidades mutables y VOs inmutables
- **Value objects** inmutables, con constructor privado y factoría estática que valida: `Letter.from('Á')`, `Phrase.create(text)`, `Lives.initial()`. Igualdad con `equals()`.
- **Agregado `Game`**: estado privado y métodos con intención (`guess(letter)`, `solve(attempt)`, `isRevealed(char)`, `letterStatus(letter)`). Las reglas viven aquí, igual que hoy en `gameReducer`. Partida terminada → ignora jugadas.
- **Agregado `PlayerStats`**: `recordWin()`, `recordLoss()`, `streak`, `record`.
- Cada agregado expone `toPrimitives()` y `fromPrimitives()` para persistencia y DTOs.
- Se mantienen los errores silenciosos actuales (letra repetida o envío vacío no hacen nada), porque así lo dicen las specs.
- Alternativa: agregados inmutables que devuelven una instancia nueva en cada jugada → encaja con React, pero es menos habitual en DDD/OOP; descartado en favor de repositorio + DTO (decisión 5).

### 3. Casos de uso como clases con `execute()`
Reciben dependencias por constructor (interfaces de dominio) y devuelven DTOs (`GameView`, `PlayerStatsView`), nunca entidades:
- `StartGame`: pide frase a `PhrasePicker`, crea `Game` y lo guarda.
- `GuessLetter` / `SolvePhrase`: cargan la partida, aplican la jugada, guardan, y si la partida acaba de terminar llaman a `RecordGameResult`.
- `GetCurrentGame`, `GetPlayerStats`: lecturas.

### 4. Estadísticas registradas en la capa de aplicación
Hoy `useStats` deduce en React cuándo terminó una partida y usa una `ref` para no contarla dos veces. Pasa a `GuessLetter`/`SolvePhrase`: comparan el estado antes y después de la jugada y, solo en la transición `playing → won/lost`, ejecutan `RecordGameResult`. Desaparece la `ref` y el riesgo de doble conteo con StrictMode.
- Alternativa: eventos de dominio + bus → más piezas para un solo consumidor; se puede introducir cuando haya más.

### 5. Puente React ↔ dominio
- `container.ts` (composition root) crea una vez las implementaciones (`InMemoryGameRepository`, `InMemoryPhraseRepository`, `MathRandomGenerator`, `LocalStoragePlayerStatsRepository`) y los casos de uso. Es el único sitio que conoce las clases concretas.
- `HangmanContext` pasa el contenedor a React; los tests pueden pasar uno con frases fijas.
- `useHangmanGame()` guarda en `useState` el `GameView` y el `PlayerStatsView` y expone `guess`, `solve`, `newGame`. Cada acción ejecuta el caso de uso y actualiza el estado con el DTO devuelto.
- Los componentes son de presentación: reciben DTOs y callbacks por props y **no importan nada de `contexts/`**. El `GameView` ya trae lo que pintan (celdas reveladas, estado de cada tecla, vidas, estado), así que dejan de llamar a `isRevealed`/`letterStatus`.
- `GamePage` compone los componentes y usa el hook. `App.tsx` desaparece en favor de `main.tsx` + `GamePage`.

Recomendación frontend resumida: **páginas** (pantallas completas, con estado) → **componentes** (piezas visuales sin lógica, una carpeta cada una con su CSS) → **hook** (único sitio que habla con la lógica). Es la estructura más habitual en proyectos React medianos y separa "qué se ve" de "qué pasa".

### 6. Estilos con CSS Modules
Cada componente tiene su `X.module.css` (clases locales, sin colisiones) y `styles/global.css` contiene solo las variables de color (claro/oscuro), el reset y `body`. Vite soporta CSS Modules sin configuración.
- Alternativa: Tailwind o styled-components → dependencias nuevas y otra forma de trabajar; descartado para este refactor.

### 7. Tests fuera de `src/`
- `tests/` replica `src/`. Vitest: `test.include = ['tests/**/*.test.{ts,tsx}']` y `setupFiles = ['tests/setup.ts']`.
- Alias `@/` → `src/` en `vite.config.ts` y `paths` en `tsconfig.app.json`, que además incluye `tests/` para que `pnpm build` también compruebe los tipos de los tests.
- **Object Mothers** (`GameMother`, `PlayerStatsMother`) junto a los tests del dominio para crear objetos de prueba legibles.
- Los tests de comportamiento actuales (escenarios de las specs) se conservan, adaptados a las nuevas clases, para garantizar que el refactor no cambia nada. El test de integración de la página se mantiene casi igual, porque prueba desde fuera.

### 8. Ajustes de TypeScript
Quitar `erasableSyntaxOnly` de `tsconfig.app.json` para permitir `constructor(private readonly repo: X)`, que es el estilo habitual en DDD con TypeScript. No afecta a Vite (usa esbuild y transforma esa sintaxis).

### 9. Orden de migración
Se construye la estructura nueva junto a la antigua, módulo a módulo, con sus tests. Cuando la UI nueva funciona y todos los tests pasan, se borra el código antiguo. Así el juego nunca queda roto a mitad del refactor. El proyecto no está en git: se recomienda inicializarlo y hacer commit antes de empezar, para poder volver atrás.

## Risks / Trade-offs

- [Más archivos y más ceremonia para un juego pequeño] → aceptado a propósito: es la base para crecer y la forma de trabajar preferida.
- [Cambiar algo de comportamiento sin querer al reescribir] → conservar todos los escenarios de test actuales y el test de integración de la página, y comprobar manualmente al final.
- [Estadísticas antiguas en `localStorage` incompatibles] → se mantiene la clave y el formato `{ streak, record }`.
- [Partida en memoria compartida entre tests] → cada test crea su propio contenedor/repositorio.
- [Refactor sin control de versiones] → inicializar git antes de aplicar (tarea 1.1).
