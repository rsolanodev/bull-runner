## Purpose

Define cómo se calcula la puntuación de la partida, cómo progresa la velocidad y cómo se conserva el récord entre sesiones.

## ADDED Requirements

### Requirement: Puntuación por distancia
El sistema SHALL acumular puntuación en función de la distancia recorrida durante la partida.

#### Scenario: Aumento por distancia
- **WHEN** la partida está en curso y el mundo avanza
- **THEN** la puntuación por distancia crece de forma proporcional al avance

### Requirement: Puntuación por monedas
El sistema SHALL sumar a la puntuación un valor configurado por cada moneda recogida.

#### Scenario: Moneda suma puntos
- **WHEN** el toro recoge una moneda
- **THEN** la puntuación total aumenta en el valor configurado para monedas y el HUD lo refleja

### Requirement: Progresión de velocidad
El sistema SHALL incrementar la velocidad de carrera con el avance de la partida y DEBE respetar una velocidad base y una velocidad máxima configuradas.

#### Scenario: Aceleración gradual
- **WHEN** la partida avanza desde el inicio
- **THEN** la velocidad aumenta gradualmente desde la velocidad base

#### Scenario: Velocidad máxima
- **WHEN** la velocidad alcanza el máximo configurado
- **THEN** la velocidad deja de aumentar y se mantiene constante

#### Scenario: Reinicio
- **WHEN** el jugador reinicia la partida
- **THEN** la velocidad vuelve a la velocidad base

### Requirement: Récord persistente
El sistema SHALL guardar la mejor puntuación en `localStorage` y DEBE mostrarla en el menú y en el game over.

#### Scenario: Nuevo récord
- **WHEN** una partida termina con una puntuación superior al récord almacenado
- **THEN** el récord se actualiza y se persiste

#### Scenario: Récord menor
- **WHEN** una partida termina con una puntuación inferior o igual al récord
- **THEN** el récord almacenado no cambia

#### Scenario: Persistencia entre sesiones
- **WHEN** se recarga la página después de establecer un récord
- **THEN** el récord guardado se recupera y se muestra
