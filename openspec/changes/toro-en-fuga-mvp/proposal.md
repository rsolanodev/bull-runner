## Why

El repositorio solo contiene un README. Queremos un MVP web jugable y original de endless runner 3D, "Toro en Fuga", que valide el bucle de carrera infinita (correr, cambiar de carril, saltar, agacharse, esquivar, recoger monedas, perder y reiniciar) usando únicamente TypeScript, Vite, Three.js y geometrías primitivas, sin depender de assets externos.

## What Changes

- Nueva aplicación Vite + TypeScript + Three.js con render 3D y bucle de juego con `deltaTime` acotado.
- Escena de calle mediterránea ficticia con segmentos reciclados y cámara de persecución estática detrás del toro.
- Toro low-poly controlable con cambio lateral suave entre tres carriles, salto y agachado.
- Obstáculos (valla baja, arco/banderines, sólidos como peatones/carretas/barriles) con spawning por patrones y object pooling.
- Sistema de colisiones por carril + estado vertical, monedas, puntuación por distancia y coleccionables, y aumento progresivo de velocidad.
- Máquina de estados con menú, HUD, pausa, game over, reinicio y récord persistente en `localStorage`.
- Controles de teclado en escritorio y gestos táctiles en móvil.
- `config.ts` central con todos los valores de física, velocidad, spawn y puntuación.
- Optimizaciones móviles: límite de pixel ratio, niebla para ocultar el spawn, material/geometría compartidos, sin allocaciones en el bucle.
- Identidad propia inspirada en el folclore del encierro y la estética mediterránea (cal, terracota, azul, olivos, banderines), evitando copiar cualquier recurso de Subway Surfers.
- Dirección de arte de ilustración urbana 3D low-poly con cel shading: cielo azul luminoso dominante, ciudad de colores saturados y alegres, materiales mates con bandas gráficas, contornos de tinta azul marino y sombras azuladas, sin nada fotorrealista.
- Código de color de gameplay: dorado casi exclusivo para monedas/recompensas, rojo y naranja para peligro, azul marino para contornos y separaciones.
- Paletas de cielo y ciudad centralizadas en `config.ts` junto al resto del tuning.

## Capabilities

### New Capabilities

- `endless-runner-core`: bucle de juego, gestión de `deltaTime`, renderer, resize, límite de pixel ratio, mundo que se desplaza, reciclado de segmentos de calle, cámara de persecución y máquina de estados de partida.
- `player-control`: movimiento del toro entre carriles, interpolación lateral, salto, agachado y traducción de entradas de teclado y táctil a intenciones.
- `obstacles-and-spawning`: tipos de obstáculos, patrones de generación, object pooling, reciclado por distancia y dificultad progresiva.
- `collision-resolution`: detección de colisiones según carril y estado vertical, y resolución (impacto/game over, recogida de monedas).
- `scoring-and-persistence`: puntuación por distancia y monedas, progresión de velocidad y récord persistente en `localStorage`.
- `game-ui`: menú, HUD, pausa, game over, reinicio y presentación accesible de la puntuación y el récord.
- `visual-identity`: dirección de arte de ilustración urbana 3D low-poly con cel shading, cielo azul dominante, paleta urbana vibrante, contornos de tinta, sombras gráficas y encuadre de cámara arcade.

### Modified Capabilities

Ninguna.

## Impact

- Crea la estructura `src/` modular tipada y el proyecto Vite (`package.json`, `tsconfig.json`, `index.html`).
- Añade dependencia de `three` (y `@types/three`), sin assets ni librerías de UI externas.
- Introduce `config.ts` como única fuente de valores ajustables, incluidas las paletas `SKY_PALETTE` y `CITY_PALETTE` y los grosores `OUTLINE_THICKNESS`.
- No afecta a APIs ni servicios existentes.
