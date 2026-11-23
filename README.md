# unaLetraMenos

Juego del ahorcado en español para el navegador. Adivina el refrán oculto letra a letra antes de quedarte sin intentos.

## Cómo se juega

- Al abrir la página empieza una partida con un **refrán español** elegido al azar (100 refranes de entre 20 y 60 caracteres). No se repite ninguno hasta haberlos jugado todos.
- La frase aparece oculta: un **cuadrado por letra**, los espacios como huecos y los signos de puntuación ya visibles.
- Pulsa letras en el **teclado en pantalla** (A–Z y Ñ):
  - Si la letra está en la frase, se desvelan todas sus apariciones y la tecla se marca en **verde**.
  - Si no está, pierdes un intento y la tecla se marca en **rojo**.
  - Cada letra solo se puede usar una vez.
  - Las tildes y diéresis no cuentan: pulsar `A` desvela también `Á`. La `Ñ` es una letra distinta de la `N`.
- Tienes **6 intentos**. Al sexto fallo pierdes.
- Si crees que ya la tienes, **escribe la frase completa** y pulsa *Probar*. No importan mayúsculas, tildes ni signos de puntuación. Si aciertas, ganas; si fallas, pierdes un intento.
- Al terminar, un cartel te felicita y ofrece otra partida, o te enseña la solución y te ofrece reintentar con otra frase.

### Contadores

En la parte inferior:

- **Victorias**: partidas ganadas seguidas. Vuelve a 0 cuando pierdes.
- **Record**: la mejor racha que has conseguido. Nunca baja.

Ambos se guardan en el navegador (`localStorage`), así que se conservan al recargar la página.

## Puesta en marcha

Requisitos: Node 20+ y [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # servidor de desarrollo en http://localhost:5173
```

| Script            | Qué hace                                         |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | Arranca el servidor de desarrollo                |
| `pnpm test`       | Ejecuta todos los tests (Vitest)                 |
| `pnpm test:watch` | Tests en modo observación                        |
| `pnpm lint`       | Revisa el código con ESLint                      |
| `pnpm build`      | Comprueba los tipos y genera la versión en `dist/` |
| `pnpm preview`    | Sirve la versión de `dist/`                      |

## Tecnología

- [React](https://react.dev) 19 + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [Vitest](https://vitest.dev) y [Testing Library](https://testing-library.com) para los tests
- CSS Modules para los estilos (con modo claro y oscuro)
- Sin backend: todo se ejecuta en el navegador

## Estructura

El código sigue **DDD** con orientación a objetos: la lógica del juego no sabe nada de React, y la interfaz solo pinta datos y llama a casos de uso.

```
src/
  contexts/hangman/           lógica del juego (bounded context "hangman")
    game/                     la partida: Game, Letter, Phrase, Lives…
      domain/                 entidades, value objects y repositorios (interfaces)
      application/            casos de uso: StartGame, GuessLetter, SolvePhrase…
      infrastructure/         implementaciones (repositorio en memoria)
    phrase/                   catálogo de refranes y selección sin repetición
    stats/                    racha y récord del jugador (guardados en localStorage)
  ui/                         interfaz en React
    pages/GamePage/           la pantalla del juego
    components/               piezas visuales sin lógica (Board, Keyboard…), cada una con su CSS
    hooks/useHangmanGame/     único puente entre React y los casos de uso
    container/                crea los repositorios y casos de uso
tests/                        tests, con la misma estructura que src/
openspec/                     especificaciones y cambios (OpenSpec)
```

Cada clase o componente vive en su propia carpeta.

## Desarrollo con OpenSpec

El proyecto se desarrolla con [OpenSpec](https://openspec.dev): cada cambio se describe antes de programarlo (propuesta, specs, diseño y tareas) en `openspec/changes/`. Al archivarlo, sus specs pasan a `openspec/specs/` como referencia de lo que hace el juego.
