# Tasks

## 1. Setup del proyecto

- [x] 1.1 Crear `.npmrc` en la raíz con `registry=https://registry.npmjs.org/` y verificar que `pnpm config get registry` dentro del proyecto devuelve el registro público
- [x] 1.2 Generar el proyecto Vite con plantilla `react-ts` en la raíz (sin borrar `openspec/`), instalar dependencias con pnpm y verificar que `pnpm dev` sirve la página por defecto
- [x] 1.3 Añadir Vitest, jsdom y Testing Library, configurar `test` en Vite y el script `pnpm test`; verificar con un test trivial que pasa
- [x] 1.4 Limpiar el contenido de ejemplo de Vite (logos, contador, estilos) y crear las carpetas `src/game`, `src/components`, `src/hooks`; verificar que `pnpm build` compila sin errores

## 2. Catálogo y selección de frases (`phrase-catalog`)

- [x] 2.1 Implementar `normalize.ts` (letra y frase: minúsculas, sin tildes ni diéresis, ñ preservada, sin puntuación, espacios colapsados) y verificar con tests que cubren Á→a, Ü→u, ñ≠n y frases con signos
- [x] 2.2 Escribir en `phrases.ts` los 100 refranes en español y verificar con un test que son 100, únicos, de 10 a 30 caracteres y solo con caracteres permitidos
- [x] 2.3 Implementar `phrasePicker.ts` con `random` inyectable, sin repeticiones hasta agotar el catálogo y reinicio del ciclo; verificar con tests que 100 llamadas devuelven 100 frases distintas y la 101 funciona

## 3. Reglas de la partida (`hangman-gameplay`)

- [x] 3.1 Implementar el estado y la acción `NEW_GAME` en `gameReducer.ts` (frase, 6 vidas, sin letras, `playing`) y verificar con test
- [x] 3.2 Implementar `GUESS_LETTER`: acierto sin coste, fallo resta vida, letra repetida ignorada, ñ distinta de n, victoria al completar y derrota a 0 vidas; verificar con tests de cada escenario del spec
- [x] 3.3 Implementar `SOLVE`: comparación normalizada, acierto gana, fallo resta vida, envío vacío ignorado; verificar con tests incluyendo "mas vale tarde que nunca"
- [x] 3.4 Ignorar cualquier acción de jugada con la partida terminada y verificar con test

## 4. Estadísticas (`game-stats`)

- [x] 4.1 Implementar `applyResult` (racha +1 al ganar, 0 al perder, récord nunca baja) y verificar con test de la secuencia gana×3, pierde, gana → racha 1, récord 3
- [x] 4.2 Implementar `loadStats`/`saveStats` sobre `localStorage` con `try/catch` y validación; verificar con tests de datos válidos, corruptos y almacenamiento que lanza error
- [x] 4.3 Implementar el hook `useStats` que aplica el resultado una sola vez por partida terminada y persiste; verificar con test que no hay doble conteo

## 5. Interfaz

- [x] 5.1 Componente `Board`: cuadrados vacíos por letra, letras descubiertas con su forma original, espacios como huecos y puntuación visible; verificar con test de render
- [x] 5.2 Componente `Keyboard` con A–Z y Ñ, teclas usadas desactivadas en verde/rojo; verificar con test que el clic dispara la acción y la tecla queda desactivada
- [x] 5.3 Componentes `LivesCounter` y `SolveForm` (campo + botón Probar); verificar con test que el envío dispara `SOLVE`
- [x] 5.4 Componente `ResultModal`: enhorabuena + "Otra partida" al ganar; frase revelada + "Reintentar" al perder; verificar con test que el botón inicia partida nueva
- [x] 5.5 Componente `StatsBar` abajo con Victorias y Record; montar todo en `App.tsx` con `useReducer`, el picker y `useStats`; verificar con un test de integración de App que juega una partida hasta ganar y otra hasta perder y comprueba los contadores
- [x] 5.6 Estilos básicos y responsive (teclado usable en móvil); verificar manualmente con `pnpm dev` en ancho de escritorio y de móvil

## 6. Verificación final

- [ ] 6.1 Ejecutar `pnpm test` y `pnpm build` sin fallos, y jugar manualmente con `pnpm dev`: ganar, perder, resolver frase, recargar y comprobar que los contadores persisten

## 7. Ampliar el rango de las frases a 20–60 caracteres

- [x] 7.1 Rehacer los 100 refranes de `spanishProverbs.ts` para que midan entre 20 y 60 caracteres: usar la versión completa cuando el actual esté recortado (p. ej. «Cría cuervos y te sacarán los ojos») y sustituir los que no lleguen a 20; actualizar a 20–60 el test del catálogo y los textos de ejemplo de los tests que dependan de frases cortas, y verificar que `pnpm test` pasa
- [x] 7.2 Comprobar visualmente a ancho de escritorio y de móvil (390 px) una partida con una frase de 60 caracteres: el tablero salta de línea por palabras, sin cortar palabras ni provocar scroll horizontal

## Workflow follow-up

- Revisar la implementación contra los specs.
- Archivar el cambio con `/openspec-archive-change` cuando esté aprobado.
