# Proposal

## Why

El proyecto está vacío y queremos una primera versión jugable (MVP) del juego del ahorcado en español como página web, para luego iterar y refactorizar sobre ella (por ejemplo, el dibujo de los intentos). Partimos de cero: no hay código ni specs previas.

## What Changes

- Nueva aplicación web de una sola página (singleplayer) que inicia una partida al cargar.
- Se elige al azar una frase de una lista fija de 100 refranes en español (entre 20 y 60 caracteres), sin repetir frases hasta agotar la lista.
- La frase se muestra oculta como cuadrados en blanco, uno por letra; los espacios son huecos y los signos de puntuación se muestran ya visibles.
- Teclado en pantalla (A–Z más Ñ) para consultar letras. Las tildes y diéresis se ignoran al comparar (pulsar A desvela también Á), pero se muestra la letra original.
- Cada letra solo se puede usar una vez: queda desactivada y se marca en verde si acierta o en rojo si falla.
- 6 vidas mostradas como un contador que baja hasta 0; cada fallo resta una vida y con 0 se pierde.
- Opción de resolver la frase completa: la comparación ignora mayúsculas y tildes; si acierta gana, si falla pierde una vida.
- Al ganar se muestra un cartel de enhorabuena con opción de jugar otra partida; al perder, un cartel con la frase revelada y opción de reintentar con una frase nueva.
- Contadores en la parte inferior: **Victorias** (racha actual, vuelve a 0 al perder) y **Record** (mejor racha, nunca se resetea), guardados en el navegador para que sobrevivan a recargas.

## Capabilities

### New Capabilities
- `phrase-catalog`: catálogo de refranes en español y selección aleatoria de la frase de cada partida sin repeticiones.
- `hangman-gameplay`: reglas y pantalla de una partida: tablero oculto, teclado, consulta de letras, vidas, resolver la frase y estados de victoria/derrota.
- `game-stats`: racha de victorias actual y récord del jugador, y su persistencia en el navegador.

### Modified Capabilities
<!-- Ninguna: no existen specs previas. -->

## Impact

- Proyecto nuevo con Vite + React + TypeScript, gestionado con pnpm, y Vitest para tests.
- Sin backend ni APIs: todo se ejecuta en el navegador; la única persistencia es `localStorage`.
- Fuera de alcance en este MVP: dibujo gráfico del ahorcado, teclado físico, otros idiomas, multijugador y despliegue.
