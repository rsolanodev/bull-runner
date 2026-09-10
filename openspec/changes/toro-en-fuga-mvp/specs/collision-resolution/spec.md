## Purpose

Define cuándo el toro impacta, cuándo recoge monedas y cómo se resuelven ambos sucesos de forma coherente con el carril y el estado vertical del toro.

## ADDED Requirements

### Requirement: Detección por carril y estado vertical
El sistema SHALL determinar una colisión por solapamiento longitudinal, cercanía lateral al carril del obstáculo y compatibilidad con el estado vertical del toro, y NO DEBE usar solo la caja envolvente global.

#### Scenario: Mismo carril en el suelo
- **WHEN** un obstáculo sólido alcanza al toro en su carril mientras este corre
- **THEN** se detecta colisión

#### Scenario: Carril distinto
- **WHEN** un obstáculo pasa por un carril distinto al del toro
- **THEN** no se detecta colisión aunque coincidan longitudinalmente

#### Scenario: Transición entre carriles
- **WHEN** el toro está a medio camino entre dos carriles
- **THEN** la detección usa su posición lateral real y no lo considera en ambos carriles a la vez

### Requirement: Impacto con obstáculo
El sistema SHALL resolver un impacto deteniendo la carrera y pasando a GAME OVER, y DEBE mostrar la puntuación obtenida.

#### Scenario: Impacto contra valla sin saltar
- **WHEN** el toro alcanza una valla baja sin estar saltando lo suficiente
- **THEN** la partida termina y se muestra el resultado

#### Scenario: Impacto contra arco sin agacharse
- **WHEN** el toro alcanza un arco o banderines sin estar agachado
- **THEN** la partida termina y se muestra el resultado

#### Scenario: Superación correcta
- **WHEN** el toro supera un obstáculo con el estado requerido
- **THEN** no hay impacto y la carrera continúa

### Requirement: Recogida de monedas
El sistema SHALL detectar el contacto con una moneda, incrementar el contador y retirar la moneda de la escena.

#### Scenario: Moneda recogida
- **WHEN** el toro pasa por la posición de una moneda activa
- **THEN** el contador de monedas aumenta y la moneda deja de estar activa

#### Scenario: Moneda no recogida
- **WHEN** la moneda pasa por un carril o altura que el toro no ocupa
- **THEN** la moneda no se contabiliza
