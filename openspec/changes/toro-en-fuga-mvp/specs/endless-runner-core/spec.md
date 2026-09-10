## Purpose

Define el bucle de ejecución, la presentación responsive y el avance infinito del mundo que sostienen toda la partida de "Toro en Fuga".

## ADDED Requirements

### Requirement: Bucle de juego con deltaTime acotado
El sistema SHALL actualizar la simulación mediante `requestAnimationFrame` y DEBE limitar el `deltaTime` a un máximo para evitar saltos tras pausas o pestañas inactivas.

#### Scenario: Actualización estable
- **WHEN** el navegador entrega fotogramas con intervalos irregulares
- **THEN** la distancia recorrida por fotograma se calcula con el tiempo transcurrido y nunca supera el máximo configurado

#### Scenario: Retorno desde pestaña inactiva
- **WHEN** la pestaña recupera el foco tras varios segundos ocultos
- **THEN** el primer `deltaTime` aplicado se acota y no provoca teletransporte del mundo ni colisiones espurias

### Requirement: Renderer responsive con límite de pixel ratio
El sistema SHALL ajustar el lienzo al tamaño de la ventana y DEBE limitar el `devicePixelRatio` usado para el render a un valor máximo configurado.

#### Scenario: Redimensionado de ventana
- **WHEN** cambia el tamaño de la ventana o del viewport
- **THEN** el lienzo, la cámara y la relación de aspecto se actualizan sin deformar la escena

#### Scenario: Pantalla de alta densidad
- **WHEN** el dispositivo reporta un `devicePixelRatio` superior al máximo configurado
- **THEN** el render usa como máximo ese valor límite

### Requirement: Avance infinito del mundo con reciclado
El sistema SHALL mantener al toro en una posición longitudinal fija mientras el entorno se desplaza hacia la cámara, reciclando los segmentos de calle que quedan por detrás.

#### Scenario: Desplazamiento continuo
- **WHEN** la partida está en curso
- **THEN** el entorno avanza a la velocidad actual y los segmentos que salen por detrás se reutilizan por delante

#### Scenario: Partida prolongada
- **WHEN** la carrera se prolonga durante un tiempo extenso
- **THEN** el número de segmentos activos se mantiene acotado y no hay degradación por acumulación de objetos

### Requirement: Cámara de persecución estable
El sistema SHALL mostrar al toro desde detrás con una cámara que no provoca temblores y DEBE acompañar suavemente el movimiento lateral.

#### Scenario: Cambio de carril
- **WHEN** el toro cambia de carril
- **THEN** la cámara sigue el desplazamiento lateral de forma suavizada y mantiene el encuadre del toro

### Requirement: Máquina de estados de partida
El sistema SHALL gestionar los estados MENÚ, JUGANDO, PAUSADO y GAME OVER, y DEBE permitir únicamente las transiciones válidas.

#### Scenario: Inicio de partida
- **WHEN** el jugador confirma desde el menú
- **THEN** la partida entra en JUGANDO y comienza el avance

#### Scenario: Pausa y reanudación
- **WHEN** el jugador pausa durante JUGANDO y después reanuda
- **THEN** la simulación se detiene y se reanuda sin acumular tiempo

#### Scenario: Fin de partida
- **WHEN** el toro impacta contra un obstáculo
- **THEN** la partida pasa a GAME OVER y se detiene el avance

#### Scenario: Pausa automática al perder foco
- **WHEN** la pestaña o ventana pierde visibilidad durante JUGANDO
- **THEN** la partida se pausa automáticamente
