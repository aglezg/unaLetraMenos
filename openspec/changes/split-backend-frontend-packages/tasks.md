# Tasks

## 1. Preparación

- [ ] 1.1 Con confirmación del usuario, hacer commit del estado actual (o, si no lo quiere, copia de seguridad de `src/`, `tests/` y la configuración); verificar con `git log` o listando la copia
- [ ] 1.2 Comprobar en una prueba desechable que Vite, Vitest y `tsc` resuelven `#src/*` declarado en `imports` de un paquete del workspace importado desde otro; verificar con un build y un test mínimos y borrar la prueba (si falla, aplicar el plan B del diseño y anotarlo en design.md)

## 2. Workspace

- [ ] 2.1 Añadir `packages: [backend, frontend]` a `pnpm-workspace.yaml`, crear `tsconfig.base.json` con las opciones comunes y dejar en el `package.json` raíz solo ESLint, TypeScript y los scripts que delegan (`dev`, `build`, `test`, `lint`, `preview`); verificar que `pnpm install` termina sin errores

## 3. Paquete `backend`

- [ ] 3.1 Crear `backend/package.json` (`@una-letra-menos/backend`, `exports` `"."` → `./src/index.ts`, `imports` `#src/*`, scripts `build: tsc --noEmit` y `test: vitest run`), `backend/tsconfig.json` y `backend/vitest.config.ts` (entorno `node`); verificar que `pnpm --filter @una-letra-menos/backend build` arranca
- [ ] 3.2 Mover `src/contexts` → `backend/src/contexts` y `tests/contexts` → `backend/tests/contexts`, cambiando los imports `@/` por `#src/`; añadir `// @vitest-environment jsdom` al test de `LocalStoragePlayerStatsRepository`; verificar que `pnpm --filter @una-letra-menos/backend test` pasa
- [ ] 3.3 Crear `backend/src/index.ts` con la API pública (casos de uso, DTOs, `GameNotStartedError` e implementaciones de infraestructura que usa el contenedor, más `SPANISH_PROVERBS`); verificar con un test que importa desde el paquete y obtiene cada símbolo

## 4. Paquete `frontend`

- [ ] 4.1 Crear `frontend/package.json` (`@una-letra-menos/frontend`, dependencia `workspace:*` del backend, `imports` `#src/*`, React, Vite, Testing Library), `frontend/tsconfig.json` y mover `vite.config.ts` e `index.html` a `frontend/`; verificar que `pnpm install` enlaza el backend (`ls frontend/node_modules/@una-letra-menos`)
- [ ] 4.2 Mover `src/ui/*` → `frontend/src/` y `tests/ui/*` + `tests/setup.ts` → `frontend/tests/`, sustituyendo imports `@/ui/` por `#src/` e imports `@/contexts/...` por `@una-letra-menos/backend`; actualizar la ruta de `index.html` a `/src/main.tsx`; verificar que `pnpm --filter @una-letra-menos/frontend test` pasa y `pnpm dev` sirve el juego

## 5. Frontera y limpieza

- [ ] 5.1 Añadir a `eslint.config.js` las reglas de frontera (backend sin React ni frontend; frontend solo importa la raíz del backend; componentes sin backend) y verificar con un import prohibido temporal que `pnpm lint` falla y, al quitarlo, pasa
- [ ] 5.2 Borrar lo que queda en la raíz (`src/`, `tests/`, `tsconfig.app.json`, `tsconfig.node.json`, `dist/`) y actualizar `.gitignore` si hace falta; verificar con `ls` que en la raíz solo quedan configuración común, `backend/`, `frontend/` y `openspec/`

## 6. Verificación final

- [ ] 6.1 Desde la raíz, ejecutar `pnpm test`, `pnpm lint` y `pnpm build` sin errores, y comprobar con `pnpm dev` que el juego se ve y funciona igual (ganar, perder, resolver, recargar y conservar contadores)

## Workflow follow-up

- Archivar `add-hangman-game-mvp` y `refactor-ddd-architecture` antes o después de aplicar este cambio.
- Archivar este cambio con `/openspec-archive-change` cuando esté revisado.
