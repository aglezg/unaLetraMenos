# Proposal

## Why

El MVP del ahorcado funciona, pero el código está organizado por tipo de archivo y en estilo funcional (`gameReducer`, `stats.ts`…), con los tests mezclados junto a la implementación. Queremos una estructura que siga DDD y orientación a objetos, fácil de navegar y de hacer crecer, antes de añadir nuevas funcionalidades.

## What Changes

- Reorganizar la lógica del juego en un contexto `hangman` con tres módulos (`game`, `phrase`, `stats`), cada uno separado en capas `domain`, `application` e `infrastructure`.
- Pasar de funciones a clases: entidades y agregados (`Game`, `PlayerStats`), value objects (`Letter`, `Phrase`, `Lives`…), repositorios como interfaces de dominio con implementaciones en infraestructura (`localStorage`, catálogo en memoria) y casos de uso como clases (`StartGame`, `GuessLetter`, `SolvePhrase`…).
- Una carpeta por clase o componente.
- Mover el registro de victorias/derrotas desde React a la capa de aplicación: al terminar una partida, el caso de uso actualiza las estadísticas.
- Reorganizar el frontend en `src/ui/` con componentes de presentación (una carpeta por componente, con su CSS Module), un hook que conecta React con los casos de uso y un punto único donde se construyen las dependencias.
- Sacar todos los tests a una carpeta `tests/` que replica la estructura de `src/`.
- Añadir el alias de importación `@/` para no depender de rutas relativas largas.
- Sin cambios de comportamiento: el juego debe funcionar exactamente igual que en el MVP.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
<!-- Ninguna: refactor sin cambios de comportamiento (skip_specs: true). Las specs del MVP (`phrase-catalog`, `hangman-gameplay`, `game-stats`) siguen siendo la referencia. -->

## Impact

- Afecta a todo `src/` y mueve todos los tests a `tests/`.
- Configuración: `tsconfig.app.json` (alias `@/`, incluir `tests/`, permitir propiedades en el constructor), `vite.config.ts` (alias y patrón de tests).
- Sin dependencias nuevas.
- La clave de `localStorage` (`meLaCompletas:stats`) se mantiene, así que las estadísticas ya guardadas siguen funcionando.
