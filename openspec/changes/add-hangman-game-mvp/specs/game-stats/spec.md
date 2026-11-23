# Spec Delta

## Purpose

Lleva la cuenta de la racha de victorias actual del jugador y de su mejor racha (récord), y las conserva en el navegador entre recargas.

## ADDED Requirements

### Requirement: Contadores visibles
El sistema SHALL mostrar en la parte inferior de la página dos contadores: "Victorias" (racha actual) y "Record" (mejor racha).

#### Scenario: Primera visita
- **WHEN** el usuario abre la página por primera vez en ese navegador
- **THEN** se muestran Victorias 0 y Record 0

### Requirement: Racha de victorias
El sistema SHALL sumar 1 a Victorias cada vez que se gana una partida y SHALL ponerlo a 0 cada vez que se pierde una partida.

#### Scenario: Ganar suma
- **WHEN** el usuario gana una partida con Victorias en 2
- **THEN** Victorias pasa a 3

#### Scenario: Perder resetea
- **WHEN** el usuario pierde una partida con Victorias en 3
- **THEN** Victorias pasa a 0

### Requirement: Récord de la mejor racha
El sistema SHALL actualizar Record al valor de Victorias cuando Victorias lo supere, y SHALL no reducirlo nunca.

#### Scenario: Secuencia de partidas
- **WHEN** partiendo de 0 el usuario gana, gana, gana, pierde y gana
- **THEN** Victorias termina en 1 y Record en 3

### Requirement: Persistencia en el navegador
El sistema SHALL guardar Victorias y Record en el almacenamiento local del navegador y restaurarlos al cargar la página. Si el almacenamiento no está disponible o contiene datos no válidos, el sistema SHALL empezar con ambos en 0 sin impedir jugar.

#### Scenario: Recarga de la página
- **WHEN** el usuario tiene Victorias 2 y Record 4 y recarga la página
- **THEN** se muestran Victorias 2 y Record 4

#### Scenario: Almacenamiento no disponible
- **WHEN** el navegador bloquea el almacenamiento local
- **THEN** el juego funciona con los contadores empezando en 0

### Requirement: Abandonar una partida no cuenta
El sistema SHALL modificar los contadores solo al terminar una partida en victoria o derrota; recargar la página a mitad de partida no SHALL cambiar Victorias ni Record.

#### Scenario: Recarga a mitad de partida
- **WHEN** el usuario recarga la página con una partida en curso y Victorias en 2
- **THEN** empieza una partida nueva y Victorias sigue en 2
