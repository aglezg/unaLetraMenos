# Tasks

## 1. Preparación

- [x] 1.1 Inicializar git con `.gitignore` adecuado y, con confirmación del usuario, hacer un commit del estado actual; verificar con `git status` que el repositorio existe (el usuario decidió no hacer el commit inicial; correo local `adriangonzalez@acidtango.com`)
- [x] 1.2 Configurar el alias `@/` → `src/` en `vite.config.ts` y `tsconfig.app.json`, incluir `tests/` en `tsconfig.app.json`, quitar `erasableSyntaxOnly`, y cambiar Vitest a `include: ['tests/**/*.test.{ts,tsx}']` con `setupFiles: ['tests/setup.ts']` (mover `src/test/setup.ts`); verificar que `pnpm test` sigue pasando los tests actuales y `pnpm build` compila

## 2. Módulo `phrase`

- [x] 2.1 Crear `RandomGenerator` (interfaz) y `MathRandomGenerator`, `PhraseRepository` (interfaz) e `InMemoryPhraseRepository` con `spanishProverbs.ts` (los mismos 100 refranes); mover los tests del catálogo a `tests/` y verificar que pasan
- [x] 2.2 Crear la clase `PhrasePicker` (sin repetir hasta agotar, reinicio del ciclo) y portar sus tests a `tests/contexts/hangman/phrase/domain/PhrasePicker/`; verificar que pasan

## 3. Módulo `game` – dominio

- [x] 3.1 Crear los VOs `Letter` (normalización de tildes, diéresis y ñ), `Alphabet` y `Phrase` (letras de la frase, comparación normalizada para resolver), portando los tests de `normalize`; verificar que pasan
- [x] 3.2 Crear los VOs `Lives` y `GameStatus` con sus tests; verificar que pasan
- [x] 3.3 Crear el agregado `Game` (`start`, `guess`, `solve`, `isRevealed`, `letterStatus`, `toPrimitives`/`fromPrimitives`) y `GameMother`, portando todos los escenarios de `gameReducer.test.ts`; verificar que pasan
- [x] 3.4 Crear `GameRepository` (interfaz) e `InMemoryGameRepository` con test; verificar que pasa

## 4. Módulo `stats`

- [x] 4.1 Crear el agregado `PlayerStats` (`recordWin`, `recordLoss`, `toPrimitives`/`fromPrimitives`) y `PlayerStatsMother`, portando los tests de `applyResult`; verificar que pasan
- [x] 4.2 Crear `PlayerStatsRepository` (interfaz) y `LocalStoragePlayerStatsRepository` (misma clave y formato, tolerante a datos corruptos o almacenamiento bloqueado), portando los tests de `loadStats`/`saveStats`; verificar que pasan
- [x] 4.3 Crear los casos de uso `GetPlayerStats` y `RecordGameResult` y el DTO `PlayerStatsView`, con tests usando un repositorio en memoria; verificar que pasan

## 5. Módulo `game` – aplicación

- [x] 5.1 Crear el DTO `GameView` (celdas con carácter/revelada, estado de cada tecla, vidas, estado, frase al terminar) y los casos de uso `StartGame` y `GetCurrentGame`, con tests; verificar que pasan
- [x] 5.2 Crear `GuessLetter` y `SolvePhrase`, que registran el resultado con `RecordGameResult` solo en la transición a `won`/`lost`; verificar con tests que una partida terminada cuenta una sola vez y que las jugadas posteriores no vuelven a contar

## 6. Frontend

- [x] 6.1 Crear `ui/container/container.ts`, `ui/context/HangmanContext` y el hook `ui/hooks/useHangmanGame`; verificar con un test del hook que jugar una partida actualiza el `GameView` y las estadísticas
- [x] 6.2 Mover `Board`, `Keyboard`, `LivesCounter`, `SolveForm`, `ResultModal` y `StatsBar` a `ui/components/<Nombre>/` con su `.module.css`, recibiendo DTOs por props sin importar nada de `contexts/`; portar sus tests a `tests/ui/components/` y verificar que pasan
- [x] 6.3 Crear `ui/pages/GamePage`, `ui/main.tsx` y `ui/styles/global.css` (variables, reset, body), apuntar `index.html` a `src/ui/main.tsx` y portar el test de integración de `App` a `tests/ui/pages/GamePage/`; verificar que pasa

## 7. Limpieza y verificación

- [x] 7.1 Borrar el código antiguo (`src/game`, `src/hooks`, `src/components`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/test`) y verificar que no quedan tests en `src/` (`find src -name "*.test.*"` vacío) ni imports de `contexts/` en `ui/components/`
- [ ] 7.2 Ejecutar `pnpm test`, `pnpm lint` y `pnpm build` sin errores y comprobar visualmente con `pnpm dev` que el juego se ve y funciona igual que antes (ganar, perder, resolver, recargar y conservar contadores)

## Workflow follow-up

- Archivar `add-hangman-game-mvp` (antes de aplicar este cambio, si es posible) para que sus specs pasen a `openspec/specs/`.
- Archivar este cambio con `/openspec-archive-change` cuando esté revisado.
