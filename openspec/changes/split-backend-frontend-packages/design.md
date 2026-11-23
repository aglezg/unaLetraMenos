# Design

## Context

Ver proposal.md (Why). Estado actual tras `refactor-ddd-architecture`:
- Un único `package.json` en la raíz con React, Vite, Vitest, Testing Library y ESLint.
- `src/contexts/hangman` (lógica) y `src/ui` (React), con el alias `@/` → `src/`.
- `tests/` replica `src/`; Vitest corre todo en `jsdom`.
- `pnpm-workspace.yaml` ya existe, pero solo para `allowBuilds: esbuild`.
- La UI importa de la lógica 15 módulos: los casos de uso, `GameView`, `PlayerStatsView`, `GameNotStartedError`, las implementaciones de infraestructura (para el contenedor) y `SPANISH_PROVERBS`. Esa lista es la base de la API pública del backend.

## Goals / Non-Goals

**Goals:**
- Dos paquetes con dependencias y configuración propias, y una frontera de importación explícita.
- Que `pnpm dev`, `pnpm test`, `pnpm build` y `pnpm lint` sigan funcionando desde la raíz.

**Non-Goals:**
- Servidor, API HTTP o persistencia nueva.
- Paso de compilación del backend: el frontend consume su código TypeScript directamente.
- Cambiar el contenido de los dominios, componentes o tests más allá de los imports.

## Decisions

### 1. Estructura

```
unaLetraMenos/
  package.json            scripts que delegan en los paquetes; ESLint y TypeScript comunes
  pnpm-workspace.yaml     packages: [backend, frontend] (+ allowBuilds)
  tsconfig.base.json      opciones de compilador comunes
  eslint.config.js        común, con reglas de frontera (decisión 5)
  .npmrc
  backend/
    package.json          @una-letra-menos/backend
    tsconfig.json
    vitest.config.ts
    src/
      index.ts            API pública
      contexts/hangman/{game,phrase,stats}/...
    tests/
      contexts/hangman/...
  frontend/
    package.json          @una-letra-menos/frontend  (depende de @una-letra-menos/backend)
    tsconfig.json
    vite.config.ts        (incluye la config de Vitest)
    index.html
    src/
      main.tsx
      container/ context/ hooks/ pages/ components/ styles/
      vite-env.d.ts
    tests/
      setup.ts
      container/ hooks/ pages/ components/
```

El contenido de `src/ui/` pasa a ser directamente `frontend/src/` (la carpeta `ui` sobra cuando el paquete entero es la UI).
- Alternativa: `apps/web` + `packages/hangman` (convención habitual de monorepos) → descartada porque se pidieron explícitamente las carpetas `backend` y `frontend`.

### 2. Paquetes en el workspace sin compilar el backend
`backend/package.json` declara `"exports": { ".": "./src/index.ts" }`. Vite y Vitest transforman TypeScript de paquetes enlazados del workspace sin configuración extra, así que no hace falta generar `dist/` para el backend. Su script `build` es solo comprobación de tipos (`tsc --noEmit`).
- Alternativa: compilar el backend a JS con declaraciones → otro paso de build y un modo "watch" para desarrollar; innecesario mientras solo lo consuma este frontend.

### 3. API pública en `backend/src/index.ts`
Un barrel que reexporta exactamente lo que el frontend necesita hoy (los 15 módulos actuales, más `LocalStoragePlayerStatsRepository` para la clave en los tests). El campo `exports` solo expone `"."`, así que importar rutas internas (`@una-letra-menos/backend/src/...`) falla en la resolución. Añadir algo a la API pasa a ser una decisión explícita.

### 4. Imports internos con subpath imports (`#src/…`) en lugar del alias `@/`
Si los dos paquetes usaran `@/`, al compilar el frontend Vite resolvería los `@/` de los archivos del backend contra `frontend/src`. Cada paquete declara en su `package.json` `"imports": { "#src/*": "./src/*" }`, que Node, Vite y TypeScript (`moduleResolution: bundler`) resuelven **relativo al paquete que contiene el archivo**. Así `#src/contexts/...` dentro del backend siempre apunta a `backend/src`, se importe desde donde se importe. El frontend usa la misma convención para sus propios archivos. Los tests de cada paquete importan con `#src/...`, y las ayudas de test (Mothers, dobles) con rutas relativas, como ahora.
- Alternativa: alias distintos (`@backend/`, `@frontend/`) configurados en Vite y en los dos tsconfig → hay que mantenerlos sincronizados en varios sitios.
- Plan B si alguna herramienta no resolviera `#src/*`: imports relativos dentro del backend. Se valida en la primera tarea, antes de mover nada.

### 5. Frontera vigilada por ESLint
En `eslint.config.js`:
- Archivos de `backend/**`: prohibido importar `react`, `react-dom` y `@una-letra-menos/frontend`.
- Archivos de `frontend/**`: prohibido importar `@una-letra-menos/backend/*` (solo la raíz del paquete).
- Se mantiene la regla actual de que `frontend/src/components/**` no importe el backend (los componentes reciben DTOs por props): pasa a ser una regla de ESLint en vez de una comprobación manual.

### 6. Tests por paquete
- `backend`: Vitest con entorno `node` por defecto. Solo el test de `LocalStoragePlayerStatsRepository` necesita navegador y lo declara con el comentario `// @vitest-environment jsdom`, lo que deja visible qué parte del backend depende del navegador.
- `frontend`: Vitest con `jsdom`, `tests/setup.ts` (jest-dom, cleanup, limpiar `localStorage`).
- `pnpm test` en la raíz ejecuta `pnpm -r test`.

### 7. Dependencias
- `backend`: solo `devDependencies` (`vitest`, `jsdom`). TypeScript se usa desde la raíz (pnpm pone los binarios de la raíz a disposición de los scripts de cada paquete).
- `frontend`: `react`, `react-dom`, `@una-letra-menos/backend` (`workspace:*`) y las de desarrollo de Vite, Testing Library y tipos de React.
- Raíz: `eslint` y sus plugins, `typescript`.
- `.npmrc` y `allowBuilds` se quedan en la raíz.

### 8. Scripts de la raíz
`dev` → `pnpm --filter @una-letra-menos/frontend dev`; `build` → `pnpm -r build` (tipos del backend + build del frontend); `test` → `pnpm -r test`; `lint` → `eslint .`; `preview` → preview del frontend.

## Risks / Trade-offs

- [Algún punto de la cadena no resuelve `#src/*`] → validarlo en la tarea 1 con un archivo de prueba; si falla, usar el plan B (imports relativos en el backend).
- [El `LocalStoragePlayerStatsRepository` vive en "backend" aunque usa una API del navegador] → aceptado: es infraestructura del dominio y no hay servidor. Si algún día hay servidor, se sustituye por otra implementación del mismo repositorio.
- [Mover muchos archivos sin commit previo] → recomendado hacer commit antes de aplicar; si no, copia de seguridad como en el refactor anterior.
- [Doble instalación de dependencias o versiones distintas de TypeScript] → una sola versión de TypeScript en la raíz; pnpm comparte paquetes entre workspaces.
