## Purpose

Define cómo el jugador controla al toro: desplazamiento entre carriles, salto, agachado y la traducción de entradas de teclado y táctil.

## ADDED Requirements

### Requirement: Carriles y cambio lateral suave
El sistema SHALL disponer de tres carriles y DEBE desplazar al toro lateralmente de forma interpolada hacia el carril seleccionado, sin saltos instantáneos.

#### Scenario: Cambio de carril contiguo
- **WHEN** el jugador pide moverse a izquierda o derecha y existe un carril contiguo
- **THEN** el toro se desplaza suavemente hasta el nuevo carril y se alinea con él

#### Scenario: Límite de carril
- **WHEN** el jugador intenta moverse más allá del carril más a la izquierda o más a la derecha
- **THEN** el toro permanece en el carril extremo sin salir de la calzada

#### Scenario: Solicitud durante el desplazamiento
- **WHEN** el jugador pide otro cambio de carril mientras el toro aún se está desplazando
- **THEN** el toro actualiza su carril objetivo y se redirige de forma suave

### Requirement: Salto
El sistema SHALL permitir saltar mediante una trayectoria con subida y bajada, y DEBE impedir un nuevo salto mientras el toro está en el aire.

#### Scenario: Salto válido
- **WHEN** el jugador pulsa saltar y el toro está en el suelo
- **THEN** el toro asciende y vuelve al suelo al cabo de la duración configurada

#### Scenario: Salto durante el salto
- **WHEN** el jugador pulsa saltar mientras el toro está en el aire
- **THEN** la orden se ignora y el salto en curso continúa

#### Scenario: Altura suficiente
- **WHEN** el toro está en la fase alta del salto
- **THEN** su hitbox vertical queda por encima de las vallas bajas

### Requirement: Agachado
El sistema SHALL permitir agacharse durante una duración configurada y DEBE reducir el perfil vertical del toro mientras dura.

#### Scenario: Agachado válido
- **WHEN** el jugador pide agacharse y el toro no está agachado
- **THEN** el toro reduce su perfil vertical durante la duración configurada y luego se incorpora

#### Scenario: Agachado durante el salto
- **WHEN** el jugador pide agacharse mientras el toro está en el aire
- **THEN** la orden se ignora hasta que el toro toque el suelo

### Requirement: Exclusión mutua entre salto y agachado
El sistema SHALL impedir que salto y agachado estén activos a la vez.

#### Scenario: Conflicto de acciones
- **WHEN** el toro está saltando y el jugador pide agacharse, o viceversa
- **THEN** solo permanece activa la acción en curso y la otra se ignora

### Requirement: Control por teclado en escritorio
El sistema SHALL asignar teclas para moverse a izquierda y derecha, saltar, agacharse, pausar y confirmar en menús.

#### Scenario: Teclas de movimiento
- **WHEN** el jugador pulsa las teclas de izquierda, derecha, saltar, agacharse o pausa
- **THEN** se dispara la intención correspondiente una sola vez por pulsación relevante

### Requirement: Control táctil en móvil
El sistema SHALL interpretar gestos de deslizamiento en pantalla para mover entre carriles, saltar y agacharse, y DEBE reconocer un toque corto como salto.

#### Scenario: Deslizamiento lateral
- **WHEN** el jugador desliza el dedo horizontalmente más allá del umbral configurado
- **THEN** el toro cambia de carril en la dirección del deslizamiento

#### Scenario: Deslizamiento vertical
- **WHEN** el jugador desliza el dedo hacia arriba o hacia abajo más allá del umbral configurado
- **THEN** el toro salta o se agacha según corresponda

#### Scenario: Toque corto
- **WHEN** el jugador toca la pantalla sin superar el umbral de deslizamiento
- **THEN** el toro salta
