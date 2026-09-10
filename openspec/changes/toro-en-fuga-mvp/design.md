## Context

Ver `proposal.md` para la motivación. El repositorio está vacío (solo `README.md`), por lo que este diseño define la estructura inicial completa. Las restricciones clave son: navegador (WebGL), TypeScript + Vite + Three.js, sin assets externos obligatorios, funcionamiento en escritorio y móvil, y una identidad visual propia de ilustración 3D low-poly con cel shading que no copie a Subway Surfers ni caiga en un look fotorrealista.

## Goals / Non-Goals

**Goals:**

- Un bucle de carrera infinita estable y con rendimiento móvil aceptable.
- Arquitectura modular y tipada donde cada sistema tenga una responsabilidad clara y testeable de forma aislada.
- Valores de física, velocidad, spawn y puntuación centralizados y fáciles de ajustar.
- Una dirección de arte cohesiva de ilustración urbana 3D low-poly con cel shading, cielo azul dominante y ciudad vibrante.
- Un vertical slice jugable (escena, toro, carriles, salto, tres obstáculos, colisiones, monedas, score, game over) como base del MVP.

**Non-Goals:**

- Física realista, colisiones con mallas o motor de físicas externo.
- Multijugador, cuentas de usuario, backend o sincronización remota.
- Assets 3D externos, animaciones con esqueleto o audio obligatorio.
- Estilo apagado, terroso, grisáceo o fotorrealista.
- Post-proceso pesado (bloom intenso, motion blur), texturas fotográficas, HDRI o reflejos de entorno.
- Editor de niveles o sistema de logros.

## Decisions

### 1. El mundo se desplaza; el toro permanece en Z fijo

El toro se queda en `z = 0` y el entorno se traslada hacia la cámara; los segmentos que salen por detrás se reciclan por delante.

- **Rationale:** evita la pérdida de precisión de coma flotante en partidas muy largas, mantiene la cámara casi estática y hace trivial el reciclado por umbral de Z.
- **Alternativa considerada:** mover al toro en `+Z` y reciclar el mundo por delante/atrás. Requiere seguir al jugador, propaga errores numéricos y complica el reciclado.

### 2. Tres capas de arquitectura

`core` (bucle, renderer, input, estado), `world`/`entities` (escena, toro, obstáculos, monedas) y `systems` (colisión, puntuación, velocidad), con `config.ts` como única fuente de constantes. Las entidades exponen datos (posición, carril, hitbox lógica) y los sistemas operan sobre ellos.

- **Rationale:** separa "qué existe" de "cómo se comporta", permite testear los sistemas sin WebGL y evita dependencias circulares.
- **Alternativa considerada:** lógica dentro de cada clase de entidad. Se descarta porque mezcla render con reglas y dificulta el pooling y el testing.

### 3. Vista como overlay DOM, no dentro de la escena

Menú, HUD, pausa y game over se implementan como HTML/CSS superpuesto al lienzo.

- **Rationale:** texto nítido, responsive y accesible sin fuentes ni sprites 3D; aísla la UI del render.
- **Alternativa considerada:** HUD en `CSS2DRenderer`/sprites. Añade coste por fotograma y complica el layout.

### 4. Colisión ligera basada en carril y estado vertical

La colisión se resuelve con solapamiento longitudinal + distancia lateral real al obstáculo + compatibilidad de estado (correr/saltar/agachar). No se usan raycasts ni mallas.

- **Rationale:** coste mínimo en móvil y suficiente para un runner de tres carriles. Además, como la decisión "carril + estado" es discreta, el diseño de patrones se vuelve legible.
- **Alternativa considerada:** `Box3.intersectsBox` sobre la malla. Más caro y sensible al tamaño de los meshes; se descarta.

### 5. Object pooling y reciclado de segmentos

Un `Pool<T>` genérico gestiona obstáculos y monedas. Los segmentos de calle forman una cola circular reutilizada por umbral de distancia.

- **Rationale:** cero allocaciones en el bucle caliente, sin pausas de GC perceptibles.
- **Alternativa considerada:** crear/destruir objetos. Provoca picos de GC y stutter, especialmente en móvil.

### 6. `config.ts` centralizado y tipado

Todos los números ajustables (pixel ratio máximo, FOV y offset de cámara, posiciones de carril, velocidades, salto, agachado, separación de spawn, tamaño de pools, valor de moneda, clave de récord, umbrales de swipe) viven en un único objeto tipado.

- **Rationale:** tuning rápido y sin caza de constantes mágicas; facilita equilibrar dificultad.
- **Alternativa considerada:** constantes junto a su uso. Se descarta por dispersión y por el riesgo de valores inconsistentes.

### 7. Bucle de render y control de tiempo

`renderer.setAnimationLoop`, `deltaTime` acotado a un máximo, pausa automática en `visibilitychange`/`blur`, y limitación de `pixelRatio` a `min(devicePixelRatio, max)`.

- **Rationale:** comportamiento consistente en distintos dispositivos y evitar el "efecto túnel" de colisiones tras un salto de tiempo.
- **Alternativa considerada:** usar el timestamp crudo. Se descarta por inestabilidad tras pausas.

### 8. Identidad y dirección de arte propias

Toro low-poly marrón con cuernos, pueblo mediterráneo ficticio (fachadas encaladas, terracota, toldos azules, olivos, banderines de fiesta, arena y piedra). Nada de metro, grafitis urbanos ni la interfaz de Subway Surfers.

- **Rationale:** cumple el requisito de originalidad y aprovecha el folclore del encierro.
- **Alternativa considerada:** reutilizar estética genérica de runner urbano. Se descarta por riesgo de parecido.

### 9. Entrada abstraída como intenciones

Teclado y táctil producen las mismas intenciones (`left`, `right`, `jump`, `slide`, `pause`, `confirm`) que consume el toro. Un toque corto equivale a `jump`.

- **Rationale:** una sola lógica de control, fácil de testear y extender.
- **Alternativa considerada:** leer dispositivos directamente en el toro. Acopla entrada y comportamiento.

### 10. Cel shading con rampa discreta y paletas centralizadas

El material principal es `MeshToonMaterial` con `flatShading: true` y una rampa de luz discreta (sombra azulada, base saturada, luz cálida). Las paletas `SKY_PALETTE` y `CITY_PALETTE` y los grosores `OUTLINE_THICKNESS` viven en `config.ts` junto al resto del tuning, para mantener coherencia entre código y arte.

- **Rationale:** el cel shading con rampa produce bandas gráficas de cómic sin iluminación fotorrealista, y centralizar paletas evita colores duplicados o divergentes.
- **Alternativa considerada:** `MeshStandardMaterial`/PBR con HDRI. Se descarta por coste y por alejarse del look arcade.

### 11. Cielo con gradiente vertical y atmósfera azul

El fondo se resuelve con un gradiente vertical de `skyTop` (arriba), `skyMain` (centro) y `skyHorizon` (horizonte); `skyMain` queda como color base de respaldo. Se añaden nubes geométricas blanco-azuladas y `Fog` azul clara. La luz combina una hemisférica (cielo/horizonte) y una direccional cálida.

- **Rationale:** un color plano no produce el degradado exigido; el gradiente da profundidad barata y permite que la niebla funda el horizonte y oculte el reciclado.
- **Alternativa considerada:** `scene.background` de color sólido (el snippet literal). Se descarta por no conseguir la transición azul profundo → celeste.

### 12. Contornos de tinta con jerarquía de grosor

Cada objeto relevante recibe una malla de contorno `BackSide` con `MeshBasicMaterial` azul marino, escalada por un factor por encima del original y con `depthWrite: false`. El grosor sigue `OUTLINE_THICKNESS` según el tipo (jugador > coleccionables > obstáculos > NPCs > props), y el fondo lejano no lleva contorno.

- **Rationale:** define siluetas y lectura inmediata, reforzando el look de cómic y separando toro/obstáculos del entorno colorido.
- **Alternativa considerada:** post-proceso de bordes (OutlinePass). Se descarta por coste y por ser menos estable en móvil.

### 13. Sombras dinámicas acotadas más sombras planas falsas

Se usa `DirectionalLight` con sombras (mapa moderado y `PCFSoftShadowMap`) y se complementa con polígonos planos semitransparentes azul oscuro sobre el asfalto que sugieren sombras de edificios, balcones, farolas y señales.

- **Rationale:** las sombras fake dan riqueza gráfica con coste casi nulo y evitan recargar el único shadow map.
- **Alternativa considerada:** solo sombras dinámicas o ninguna. Las primeras cuestan demasiado en móvil; las segundas dejan la calle plana.

### 14. Cámara con perspectiva marcada y código de color de gameplay

La cámara usa FOV en el rango 64-70, muestra cielo amplio, sitúa al toro en el tercio inferior central con horizonte alto y enmarca la calle con edificios laterales, con inclinación lateral sutil al cambiar de carril y sin motion blur. La paleta reserva el dorado para recompensas, rojo/naranja para peligro y azul marino para contornos y separaciones.

- **Rationale:** el encuadre amplio y expresivo es parte del atractivo arcade y el código de color hace el gameplay legible de un vistazo.
- **Alternativa considerada:** cámara más baja y centrada. Se descarta por tapar el cielo y reducir la sensación de velocidad y profundidad.

## Risks / Trade-offs

- [Sensación del control en móvil] → umbrales de swipe configurables, hitbox táctil generosa y pruebas manuales en distintos tamaños.
- ["Suelo resbaladizo" entre carriles o colisión injusta al transicionar] → la detección usa la X real interpolada y los patrones garantizan un carril libre.
- [Dificultad mal calibrada] → todos los parámetros en `config.ts`; la velocidad base/máxima y los gaps de spawn se ajustan sin tocar lógica.
- [Fatiga visual en partidas largas] → fog y variación de segmentos; el mundo se recicla pero mantiene variedad de decorados.
- [Rendimiento en móviles modestos] → pixel ratio limitado, sin sombras costosas, materiales/geometrías compartidos y pools acotados.
- [Confusión por parecido al género] → dirección de arte y nombres propios; no se reutiliza ningún recurso ajeno.
- [Saturación alta que dañe la legibilidad del gameplay] → código de color estricto (dorado recompensa, rojo/naranja peligro, marino contorno) y validación de contraste toro/asfalto/obstáculo.
- [Coste de los outlines al duplicar draw calls] → contorno solo en objetos relevantes, sin contorno en el fondo lejano, y geometría/material compartidos.
- [Look caótico por exceso de colores] → alternancia de fachadas por bloque y reducción de saturación/detalle en distancia.
- [Sombras dinámicas caras en móvil] → shadow map moderado, sombras fake planas como base y opción de desactivar sombras por config.

## Migration Plan

No aplica: es la creación inicial del proyecto. El despliegue es estático (`vite build` + hosting de ficheros estáticos). No hay datos que migrar; el único estado persistente es el récord en `localStorage`, reiniciable por el usuario.

## Open Questions

- Si el sonido se aplaza, se añadiría después como sistema opcional sin cambiar los specs.
- El número exacto de patrones de obstáculos para el MVP (más allá de los tres tipos) se puede ampliar sin modificar la arquitectura.
