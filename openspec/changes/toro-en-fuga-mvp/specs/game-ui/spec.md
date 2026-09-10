## Purpose

Define las pantallas e indicadores que informan al jugador del estado de la partida y le permiten iniciar, pausar, reiniciar y consultar su récord.

## ADDED Requirements

### Requirement: Menú principal
El sistema SHALL mostrar un menú al cargar con el título del juego, el récord, las instrucciones básicas y una acción para comenzar.

#### Scenario: Carga inicial
- **WHEN** se carga la aplicación
- **THEN** se muestra el menú en estado MENÚ y no comienza la carrera hasta que el jugador confirma

#### Scenario: Récord visible en menú
- **WHEN** existe un récord guardado
- **THEN** el menú lo muestra

### Requirement: HUD durante la partida
El sistema SHALL mostrar en pantalla, mientras se juega, la puntuación actual, las monedas recogidas y un control de pausa.

#### Scenario: Actualización del HUD
- **WHEN** cambian la puntuación o las monedas durante la partida
- **THEN** el HUD refleja los valores actualizados

### Requirement: Pausa
El sistema SHALL ofrecer una pantalla de pausa que detiene la simulación y permite reanudar o volver al menú.

#### Scenario: Reanudar
- **WHEN** el jugador elige reanudar desde la pausa
- **THEN** la partida continúa desde donde se detuvo

#### Scenario: Volver al menú
- **WHEN** el jugador elige volver al menú desde la pausa
- **THEN** la partida se abandona y se muestra el menú

### Requirement: Game over y reinicio
El sistema SHALL mostrar una pantalla de fin de partida con la puntuación obtenida, el récord y acciones para reiniciar o volver al menú.

#### Scenario: Fin de partida
- **WHEN** el toro impacta contra un obstáculo
- **THEN** se muestra la pantalla de game over con la puntuación final y el récord

#### Scenario: Reinicio
- **WHEN** el jugador elige reiniciar desde el game over
- **THEN** la partida comienza de nuevo desde el estado inicial

### Requirement: Adaptabilidad de la interfaz
El sistema SHALL mantener la interfaz legible y usable tanto en pantallas de escritorio como en móviles.

#### Scenario: Pantalla pequeña
- **WHEN** la interfaz se muestra en un viewport móvil
- **THEN** los controles y textos se mantienen visibles y accionables sin desbordarse
