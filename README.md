# Toro en Fuga

Endless runner 3D original para navegador, con estética de ilustración urbana low-poly y cel shading. Controlas un toro que corre sin parar por un pueblo mediterráneo ficticio: cambia de carril, salta vallas, se agacha bajo arcos y banderines, esquiva obstáculos y recoge monedas.

Construido con **TypeScript + Vite + Three.js** usando solo geometrías y materiales primitivos, sin assets externos ni recursos de otros juegos.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

### Otros scripts

| Script              | Descripción                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Servidor de desarrollo con recarga en caliente         |
| `npm run build`     | Typecheck + build de producción en `dist/`             |
| `npm run preview`   | Sirve el build de producción                           |
| `npm run typecheck` | Comprobación de tipos sin emitir                       |

## Controles

**Escritorio**

- `←` / `→` o `A` / `D`: cambiar de carril
- `↑`, `W` o `Espacio`: saltar
- `↓` o `S`: agacharse
- `P` o `Esc`: pausa
- `Enter`: confirmar en menús

**Móvil**

- Desliza a izquierda/derecha: cambiar de carril
- Desliza hacia arriba: saltar
- Desliza hacia abajo: agacharse
- Toca la pantalla: saltar

## Mecánicas

- **Puntuación**: crece con la distancia recorrida y con las monedas recogidas.
- **Dificultad progresiva**: la velocidad sube desde la base hasta un máximo y los patrones de obstáculos se vuelven más exigentes.
- **Obstáculos**:
  - Valla baja: se supera **saltando**.
  - Arco/banderines: se supera **agachándose**.
  - Barril/obstáculo sólido: se supera **cambiando de carril**.
- **Récord**: se guarda en `localStorage` y se muestra en el menú y en el game over.
- **Pausa automática** al perder el foco de la pestaña o la ventana.

## Arquitectura

```
src/
├── main.ts                 arranque de la aplicación
├── config.ts               TODO el tuning: paletas, física, velocidad, spawn, score
├── core/
│   ├── Game.ts             orquestador y máquina de estados
│   ├── Loop.ts             requestAnimationFrame + deltaTime acotado
│   ├── Renderer.ts         escena, cámara, resize y límite de pixel ratio
│   └── Input.ts            teclado y gestos táctiles → intenciones
├── state/GameState.ts      MENÚ · JUGANDO · PAUSADO · GAME OVER
├── world/
│   ├── World.ts            cielo con gradiente, nubes, niebla y luces
│   ├── SegmentManager.ts   ciudad procedural con reciclado de segmentos
│   ├── LaneSystem.ts       tres carriles e interpolación lateral
│   └── Spawner.ts          patrones de obstáculos y monedas con pooling
├── entities/
│   ├── Bull.ts             toro low-poly, salto, agachado y animación
│   ├── Obstacle.ts         valla, arco y sólido
│   └── Coin.ts             moneda giratoria
├── systems/
│   ├── CollisionSystem.ts  colisión por carril y estado vertical
│   ├── ScoreSystem.ts      puntuación por distancia y monedas
│   └── SpeedSystem.ts      progresión de velocidad y dificultad
├── ui/
│   ├── HUD.ts              puntuación, monedas y pausa
│   └── Screens.ts          menú, pausa y game over
├── storage/HighScore.ts    persistencia del récord en localStorage
└── utils/
    ├── Pool.ts             object pool genérico
    └── visuals.ts          materiales toon, rampa de luz, outlines y sombras
```

### Decisiones de rendimiento

- El toro permanece fijo en Z y el mundo se desplaza y recicla, evitando el drift de precisión.
- Object pooling de obstáculos y monedas: sin allocaciones en el bucle de juego.
- `pixelRatio` limitado, `deltaTime` acotado, geometrías y materiales compartidos, y pausa automática cuando la pestaña no está visible.
- La niebla azul clara oculta el reciclado de segmentos.

## Configuración

Todo el equilibrio del juego vive en [`src/config.ts`](src/config.ts): paletas `SKY_PALETTE`, `CITY_PALETTE`, `BULL_PALETTE` y `OUTLINE_THICKNESS`, además de velocidad, salto, agachado, spawn, pools, puntuación e input.

## Originalidad

La referencia es únicamente el género de carrera infinita. Todos los recursos —personaje, escenario, interfaz e identidad visual— son originales, generados con primitivas de Three.js, y no reutilizan materiales, personajes ni interfaces de Subway Surfers.
