## Purpose

Define la dirección de arte de "Toro en Fuga": una ilustración urbana 3D low-poly con cel shading, soleada, enérgica y arcade, con cielo azul dominante, ciudad colorida, contornos de tinta y sombras gráficas, evitando cualquier aspecto apagado, terroso o fotorrealista.

## ADDED Requirements

### Requirement: Estilo de ilustración 3D arcade con cel shading
El sistema SHALL renderizar la escena con un estilo low-poly de bandas gráficas y materiales mates, y NO DEBE usar texturas fotográficas, materiales PBR detallados, metal cromado, HDRI, reflejos de entorno, bloom intenso, motion blur ni sombras negras.

#### Scenario: Sombreado por bandas
- **WHEN** se ilumina una superficie de un objeto
- **THEN** el color se resuelve en bandas discretas con sombra azulada o verde-azulada, color base saturado y luz cálida ligeramente amarilla

#### Scenario: Material mate
- **WHEN** el toro, los obstáculos, los coleccionables o el entorno reciben luz
- **THEN** no presentan reflejos especulares ni reflejos de entorno

#### Scenario: Nitidez del gameplay
- **WHEN** la partida está en curso
- **THEN** no se aplican filtros que resten nitidez o contraste a la acción

### Requirement: Cielo azul dominante y atmósfera
El sistema SHALL usar un cielo que sea el color dominante del fondo, con un gradiente de azul profundo arriba, azul brillante en el centro y azul celeste luminoso hacia el horizonte, e incorporar nubes grandes estilizadas, niebla de distancia azul clara, luz solar cálida y sombras azuladas.

#### Scenario: Lectura del cielo
- **WHEN** se observa el fondo de la escena
- **THEN** predomina un azul luminoso con transición visible de oscuro arriba a celeste en el horizonte

#### Scenario: Nubes y niebla
- **WHEN** se mira hacia el horizonte
- **THEN** se aprecian nubes geométricas blanco-azuladas y una niebla azul clara que funde la distancia

#### Scenario: Sin negros puros
- **WHEN** una zona queda en sombra
- **THEN** su color tiende al azul o al verde-azulado y no al negro puro

### Requirement: Paleta urbana vibrante con alternancia
El sistema SHALL construir las fachadas y la decoración urbana con bloques de color saturados y alegres, alternando los tonos por bloque urbano y reservando los más luminosos para elementos interactivos y rutas de interés.

#### Scenario: Variedad de fachadas
- **WHEN** se observa un bloque de edificios
- **THEN** las fachadas alternan colores vivos como crema, amarillo, coral, rosa, turquesa, menta, lavanda y azul, sin que todos los edificios compartan el mismo tono

#### Scenario: Profundidad por saturación
- **WHEN** los edificios están lejos del toro
- **THEN** reducen su saturación, detalle y contraste respecto a los cercanos

#### Scenario: Acento de color de juego
- **WHEN** un elemento es interactivo o una ruta de interés
- **THEN** usa los colores más luminosos de la paleta frente al entorno

### Requirement: Código de color de gameplay
El sistema SHALL reservar el amarillo dorado casi exclusivamente para monedas, recompensas y objetivos, y SHALL usar rojo y naranja para peligro, obstáculos y señales de reacción inmediata, reservando el azul marino para contornos, cavidades y separaciones.

#### Scenario: Recompensa dorada
- **WHEN** aparece una moneda o un objeto de recompensa
- **THEN** se distingue por un dorado brillante que no se confunde con el entorno

#### Scenario: Señal de peligro
- **WHEN** aparece un obstáculo o una señal de peligro
- **THEN** emplea rojo o naranja como acento reconocible

#### Scenario: Separación por tinta
- **WHEN** dos superficies o volúmenes colindan
- **THEN** el azul marino oscuro marca el contorno o la separación sin recurrir al negro puro

### Requirement: Contornos de tinta con grosor por tipo
El sistema SHALL aplicar contornos geométricos de color azul marino oscuro a los objetos relevantes, con grosor proporcional a su importancia para la jugabilidad.

#### Scenario: Jerarquía de outline
- **WHEN** se comparan los contornos del toro, los obstáculos, los coleccionables y los NPCs
- **THEN** el toro tiene el contorno más grueso, los coleccionables y los obstáculos peligrosos un contorno grueso-medio, y los NPCs, props y señales un contorno más fino

#### Scenario: Detalle por distancia
- **WHEN** un edificio está en primer plano frente a uno del fondo
- **THEN** el cercano puede mostrar contorno fino y el lejano no lleva contorno individual

#### Scenario: Silueta limpia
- **WHEN** un objeto con contorno se superpone a otro o al fondo
- **THEN** su silueta se mantiene legible y no se producen artefactos de profundidad

### Requirement: Silueta y legibilidad de los elementos de juego
El sistema SHALL diferenciar claramente del asfalto al toro, los obstáculos y los coleccionables, de modo que se identifiquen de forma instantánea.

#### Scenario: Toro destacado
- **WHEN** el toro corre sobre el asfalto
- **THEN** su cuerpo marrón oscuro, luces marrones cálidas, cuernos crema y contorno azul marino lo mantienen visible aunque el entorno sea colorido

#### Scenario: Obstáculos legibles
- **WHEN** aparece un obstáculo
- **THEN** es grande, simple y reconocible, con un color que comunica su función

#### Scenario: Coleccionables inequívocos
- **WHEN** aparece una moneda o recompensa
- **THEN** su color y contorno la distinguen de inmediato del resto

### Requirement: Sombras gráficas por bloques
El sistema SHALL producir sombras de bandas discretas con luz cálida y sombras azuladas, y DEBE complementar las sombras dinámicas con sombras planas semitransparentes que sugieran edificios, balcones, farolas y señales sobre el asfalto.

#### Scenario: Sombra gráfica
- **WHEN** un objeto proyecta sombra
- **THEN** la sombra se resuelve en una banda azulada y no en un degradado fotorrealista

#### Scenario: Sombra plana ambiental
- **WHEN** se observa el asfalto
- **THEN** se aprecian polígonos planos semitransparentes de color azul oscuro que sugieren sombras urbanas sin recargar las sombras dinámicas

### Requirement: Cámara, encuadre y profundidad
El sistema SHALL usar una cámara de tercera persona con perspectiva marcada que muestre una porción amplia de cielo, sitúe al toro en el tercio inferior central, mantenga el horizonte relativamente alto y enmarque la calle con edificios cercanos a ambos lados.

#### Scenario: Encuadre de partida
- **WHEN** la partida está en curso
- **THEN** el toro aparece en el tercio inferior central con cielo azul visible sobre el horizonte

#### Scenario: Ángulo de visión
- **WHEN** se configura la cámara
- **THEN** su campo de visión se mantiene en el rango de 64 a 70 grados

#### Scenario: Profundidad
- **WHEN** el jugador mira al frente
- **THEN** la perspectiva, los objetos laterales grandes y la niebla azul clara transmiten profundidad y ocultan el reciclado de segmentos

#### Scenario: Inclinación al cambiar de carril
- **WHEN** el toro cambia de carril
- **THEN** la cámara aplica una inclinación lateral sutil, sin motion blur

### Requirement: Rendimiento visual en escritorio y móvil
El sistema SHALL mantener el estilo visual con un rendimiento adecuado tanto en escritorio como en móvil.

#### Scenario: Presupuesto móvil
- **WHEN** la aplicación se ejecuta en un dispositivo móvil
- **THEN** el estilo se conserva usando geometría de bajo coste, materiales compartidos y el límite de pixel ratio configurado

#### Scenario: Estilo en el reciclado
- **WHEN** los segmentos de escenario se reciclan
- **THEN** el estilo (cielo, paleta, outlines y sombras) se mantiene coherente sin coste creciente
