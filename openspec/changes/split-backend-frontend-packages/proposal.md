# Proposal

## Why

Tras el refactor a DDD, la lógica (`src/contexts`) y la interfaz (`src/ui`) siguen en el mismo proyecto, con una sola configuración y dependencias compartidas, y nada impide que la UI importe cualquier clase interna del dominio. Queremos separarlas físicamente en dos paquetes, `backend` y `frontend`, para que la frontera sea explícita y cada parte evolucione por su lado (y, si algún día hace falta, el `backend` pueda pasar a un servidor sin tocar el dominio).

## What Changes

- Convertir el repositorio en un monorepo con pnpm workspaces y dos paquetes:
  - `backend/`: la lógica DDD (`contexts/hangman`), sin React ni Vite, con sus propios tests.
  - `frontend/`: la aplicación React (página, componentes, hook, contenedor), con sus propios tests.
- El `backend` expone una **API pública** (un único punto de entrada) con los casos de uso, los DTOs, los errores y las implementaciones de infraestructura que necesita el contenedor del frontend. El frontend no puede importar nada interno del backend.
- Cada paquete tiene su `package.json`, `tsconfig.json`, configuración de Vitest y carpeta `tests/`.
- La raíz queda solo con la configuración común (workspace, ESLint, TypeScript base) y scripts que lanzan los de cada paquete (`pnpm dev`, `pnpm test`, `pnpm build`, `pnpm lint`).
- **Sin servidor:** "backend" es el nombre de la capa de lógica; todo sigue ejecutándose en el navegador como hasta ahora.
- Sin cambios de comportamiento ni visuales.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
<!-- Ninguna: reorganización sin cambios de comportamiento (skip_specs: true). -->

## Impact

- Mueve `src/contexts` → `backend/src/contexts` y `src/ui` → `frontend/src`, con sus tests correspondientes.
- Sustituye el alias `@/` por imports de subruta de cada paquete (`#src/…`) y añade la dependencia `"@una-letra-menos/backend": "workspace:*"` en el frontend.
- Mueve `index.html`, `vite.config.ts` y las dependencias de React/Vite a `frontend/`.
- Depende de que `refactor-ddd-architecture` esté terminado (le queda la prueba manual 7.2).
- La clave de `localStorage` no cambia.
