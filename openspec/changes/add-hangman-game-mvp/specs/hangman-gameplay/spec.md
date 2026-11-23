# Spec Delta

## Purpose

Define las reglas y la pantalla de una partida del ahorcado en español: la frase oculta, el teclado en pantalla, las vidas, la resolución de la frase y los finales de victoria y derrota.

## ADDED Requirements

### Requirement: Partida iniciada al cargar la página
El sistema SHALL iniciar automáticamente una partida al cargar la página, con una frase nueva, 6 vidas y ninguna letra usada.

#### Scenario: Carga inicial
- **WHEN** el usuario abre la página
- **THEN** se muestra una partida en curso con el tablero oculto, el teclado completo habilitado y el contador de vidas en 6

### Requirement: Tablero con la frase oculta
El sistema SHALL mostrar la frase como una secuencia de cuadrados, uno por cada letra, vacíos mientras la letra no se haya descubierto. Los espacios SHALL mostrarse como huecos sin cuadrado y los signos de puntuación SHALL mostrarse visibles desde el inicio.

#### Scenario: Frase recién elegida
- **WHEN** empieza una partida con la frase "Más vale tarde, que nunca"
- **THEN** se ven 20 cuadrados vacíos agrupados en 5 palabras separadas por huecos, y la coma es visible

#### Scenario: La frase no se revela
- **WHEN** la partida está en curso
- **THEN** ninguna letra no descubierta es visible en pantalla

### Requirement: Teclado en pantalla
El sistema SHALL ofrecer un teclado en pantalla con las 27 letras del alfabeto español (A–Z y Ñ) como única forma de consultar letras.

#### Scenario: Letras disponibles
- **WHEN** empieza una partida
- **THEN** el teclado muestra las letras A a Z y la Ñ, todas habilitadas

### Requirement: Consulta de una letra acertada
Al pulsar una letra que aparece en la frase, el sistema SHALL desvelar todas sus apariciones sin restar vidas. La comparación SHALL ignorar mayúsculas, tildes y diéresis, mostrando en el cuadrado la letra original de la frase. La Ñ SHALL tratarse como letra distinta de la N.

#### Scenario: Letra con varias apariciones
- **WHEN** la frase es "Más vale tarde, que nunca" y el usuario pulsa A
- **THEN** se desvelan todas las A, incluida la Á de "Más", y las vidas no cambian

#### Scenario: Ñ distinta de N
- **WHEN** la frase contiene "año" pero ninguna N y el usuario pulsa N
- **THEN** la letra cuenta como fallo y la ñ sigue oculta

### Requirement: Consulta de una letra fallada
Al pulsar una letra que no aparece en la frase, el sistema SHALL restar una vida.

#### Scenario: Letra fallada
- **WHEN** el usuario pulsa una letra que no está en la frase y le quedan 6 vidas
- **THEN** el contador de vidas pasa a 5

### Requirement: Cada letra solo se usa una vez
Tras pulsar una letra, el sistema SHALL desactivarla en el teclado y marcarla en verde si estaba en la frase o en rojo si no estaba. Una letra desactivada SHALL no poder volver a pulsarse.

#### Scenario: Letra acertada marcada
- **WHEN** el usuario pulsa una letra que está en la frase
- **THEN** la tecla queda desactivada y en verde

#### Scenario: Letra fallada marcada
- **WHEN** el usuario pulsa una letra que no está en la frase
- **THEN** la tecla queda desactivada y en rojo

#### Scenario: Letra ya usada
- **WHEN** el usuario intenta pulsar una letra desactivada
- **THEN** no ocurre nada y las vidas no cambian

### Requirement: Contador de vidas
El sistema SHALL mostrar en todo momento las vidas restantes como un número que empieza en 6 y baja con cada fallo hasta 0.

#### Scenario: Vidas visibles
- **WHEN** la partida está en curso
- **THEN** se ve el número de vidas restantes

### Requirement: Resolver la frase completa
El sistema SHALL permitir escribir la frase completa e intentarla. La comparación SHALL ignorar mayúsculas, tildes, diéresis, signos de puntuación y espacios sobrantes al principio, al final o repetidos. Si coincide, el usuario gana; si no, pierde una vida.

#### Scenario: Resolución correcta
- **WHEN** la frase es "Más vale tarde, que nunca" y el usuario envía "mas vale tarde que nunca"
- **THEN** la partida termina en victoria y se desvela la frase completa

#### Scenario: Resolución incorrecta
- **WHEN** el usuario envía una frase que no coincide y le quedan 3 vidas
- **THEN** el contador de vidas pasa a 2 y la partida continúa

#### Scenario: Envío vacío
- **WHEN** el usuario envía el campo de resolver vacío o solo con espacios
- **THEN** no ocurre nada y las vidas no cambian

### Requirement: Victoria
Cuando todas las letras de la frase están descubiertas, o el usuario la resuelve correctamente, el sistema SHALL terminar la partida y mostrar un cartel de enhorabuena con la opción de jugar otra partida.

#### Scenario: Última letra descubierta
- **WHEN** el usuario pulsa la última letra que faltaba por descubrir
- **THEN** se muestra el cartel de enhorabuena con un botón para jugar otra partida

#### Scenario: Otra partida tras ganar
- **WHEN** el usuario pulsa jugar otra partida en el cartel de victoria
- **THEN** empieza una partida nueva con otra frase, 6 vidas y el teclado completo habilitado

### Requirement: Derrota
Cuando las vidas llegan a 0, el sistema SHALL terminar la partida y mostrar un cartel de derrota que revela la frase completa y ofrece reintentar con una frase nueva.

#### Scenario: Sexta equivocación
- **WHEN** el usuario falla con 1 vida restante
- **THEN** las vidas pasan a 0 y se muestra el cartel de derrota con la frase completa

#### Scenario: Reintentar tras perder
- **WHEN** el usuario pulsa reintentar en el cartel de derrota
- **THEN** empieza una partida nueva con una frase distinta, 6 vidas y el teclado completo habilitado

### Requirement: Partida terminada bloquea las jugadas
Cuando la partida ha terminado, el sistema SHALL ignorar cualquier consulta de letra o intento de resolver hasta que empiece una partida nueva.

#### Scenario: Pulsar tras terminar
- **WHEN** la partida ha terminado y el usuario intenta pulsar una letra
- **THEN** no cambian ni el tablero ni las vidas
