# Spec Delta

## Purpose

Proporciona las frases del juego: un catálogo fijo de refranes en español y la selección aleatoria de la frase de cada partida evitando repeticiones.

## ADDED Requirements

### Requirement: Catálogo de refranes en español
El sistema SHALL incluir una lista fija de exactamente 100 refranes en español, sin duplicados, cada uno con una longitud de entre 20 y 60 caracteres (contando espacios y signos).

#### Scenario: Tamaño del catálogo
- **WHEN** se consulta el catálogo de frases
- **THEN** contiene exactamente 100 frases distintas

#### Scenario: Longitud de cada frase
- **WHEN** se mide la longitud de cualquier frase del catálogo
- **THEN** tiene como mínimo 20 y como máximo 60 caracteres

#### Scenario: Caracteres admitidos
- **WHEN** se analiza cualquier frase del catálogo
- **THEN** solo contiene letras del alfabeto español (incluidas Ñ, vocales con tilde y Ü), espacios y signos de puntuación

### Requirement: Selección aleatoria de la frase
El sistema SHALL elegir al azar la frase de cada partida nueva entre las frases del catálogo que todavía no se han jugado.

#### Scenario: Inicio de partida
- **WHEN** empieza una partida nueva
- **THEN** la frase de la partida es una del catálogo elegida al azar

### Requirement: Sin repeticiones hasta agotar el catálogo
El sistema SHALL no repetir una frase mientras queden frases del catálogo sin jugar en la sesión actual de la página; cuando se han jugado todas, el ciclo vuelve a empezar con el catálogo completo.

#### Scenario: Partidas consecutivas
- **WHEN** se juegan varias partidas seguidas sin recargar la página y quedan frases sin jugar
- **THEN** ninguna frase aparece dos veces

#### Scenario: Catálogo agotado
- **WHEN** ya se han jugado las 100 frases y empieza una partida nueva
- **THEN** se vuelve a elegir al azar entre todo el catálogo
