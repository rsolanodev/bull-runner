## Purpose

Define qué obstáculos aparecen, cómo se generan de forma justa y cómo se reutilizan mediante pooling y reciclado para sostener una carrera infinita.

## ADDED Requirements

### Requirement: Tipos de obstáculos con evitación requerida
El sistema SHALL generar al menos tres tipos de obstáculos: vallas bajas que se superan saltando, arcos o banderines que se superan agachándose, y obstáculos sólidos que se superan cambiando de carril.

#### Scenario: Valla baja
- **WHEN** aparece una valla baja en el carril del toro
- **THEN** el toro solo la supera si está saltando en el momento del contacto

#### Scenario: Arco o banderines
- **WHEN** aparece un arco o banderines sobre el carril del toro
- **THEN** el toro solo los supera si está agachado en el momento del contacto

#### Scenario: Obstáculo sólido
- **WHEN** aparece un obstáculo sólido en un carril
- **THEN** el toro debe estar en otro carril para no impactar

### Requirement: Generación de patrones por delante
El sistema SHALL generar grupos de obstáculos y monedas por delante del toro, a partir de patrones configurados, y DEBE dejar siempre al menos un carril libre para poder superar cada grupo.

#### Scenario: Grupo generado
- **WHEN** se genera un nuevo grupo de obstáculos
- **THEN** al menos un carril queda transitable para el toro

#### Scenario: Separación mínima
- **WHEN** se suceden dos grupos de obstáculos
- **THEN** la separación entre ellos respeta la distancia mínima configurada según la velocidad actual

### Requirement: Object pooling sin allocaciones en el bucle
El sistema SHALL reutilizar instancias de obstáculos y monedas mediante un pool, y NO DEBE crear ni destruir objetos durante el bucle de juego normal.

#### Scenario: Reutilización de obstáculo
- **WHEN** un obstáculo sale de la zona activa
- **THEN** se devuelve al pool y se reutiliza en una generación posterior en lugar de crearse de nuevo

#### Scenario: Pico de generación
- **WHEN** la partida genera muchos objetos simultáneos
- **THEN** el número de objetos creados se mantiene acotado por el tamaño del pool

### Requirement: Dificultad progresiva en la generación
El sistema SHALL incrementar la exigencia de los patrones a medida que avanza la partida, dentro de un límite máximo configurado.

#### Scenario: Progresión
- **WHEN** aumenta la distancia recorrida
- **THEN** la frecuencia o la complejidad de los grupos aumenta de forma gradual

#### Scenario: Techo de dificultad
- **WHEN** se alcanza el límite máximo configurado
- **THEN** la exigencia deja de crecer y se mantiene estable
