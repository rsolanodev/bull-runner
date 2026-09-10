## 1. Configuración del proyecto

- [x] 1.1 Inicializar Vite + TypeScript en la raíz (package.json, tsconfig.json, index.html, estructura src/) y añadir `three` y `@types/three`
- [x] 1.2 Crear `src/config.ts` tipado con todos los valores de render, cámara, carriles, física, velocidad, salto, agachado, spawn, pools, puntuación, input y clave de localStorage, incluidas `SKY_PALETTE`, `CITY_PALETTE` y `OUTLINE_THICKNESS`
- [x] 1.3 Añadir estilos base y contenedor del lienzo y del overlay de UI en `index.html`/CSS
- [x] 1.4 Configurar scripts de `dev`, `build`, `preview` y `typecheck` y verificar que el proyecto compila

## 2. Núcleo del motor

- [x] 2.1 Implementar `core/Loop.ts` con `requestAnimationFrame`/`setAnimationLoop` y `deltaTime` acotado
- [x] 2.2 Implementar `core/Renderer.ts` con escena, cámara, `WebGLRenderer`, resize y límite de pixel ratio
- [x] 2.3 Implementar `state/GameState.ts` con los estados MENÚ, JUGANDO, PAUSADO y GAME OVER y transiciones válidas
- [x] 2.4 Implementar `core/Input.ts` que traduzca teclado y eventos táctiles a intenciones, incluido tap = salto
- [x] 2.5 Implementar pausa automática en `visibilitychange`/`blur`

## 3. Vertical slice: mundo, toro y control

- [x] 3.1 Construir `world/World.ts` con cielo de gradiente azul, atmósfera, luces y suelo de calle
- [x] 3.2 Implementar `world/SegmentManager.ts` con segmentos reciclados por umbral de Z
- [x] 3.3 Crear el toro low-poly en `entities/Bull.ts` con primitivas y una animación de carrera simple
- [x] 3.4 Implementar `world/LaneSystem.ts` con tres carriles y cambio lateral interpolado, respetando límites
- [x] 3.5 Implementar el salto con trayectoria de subida/bajada y bloqueo de re-salto
- [x] 3.6 Configurar la cámara de persecución con seguimiento lateral suavizado
- [x] 3.7 Validar el vertical slice: escena, toro, cámara, carriles y salto funcionando juntos

## 4. Obstáculos, generación y pooling

- [x] 4.1 Implementar `utils/Pool.ts` genérico reutilizable sin allocaciones en el bucle
- [x] 4.2 Crear `entities/Obstacle.ts` con los tres tipos: valla baja, arco/banderines y sólido
- [x] 4.3 Implementar `world/Spawner.ts` con patrones que dejan siempre al menos un carril libre y respetan la separación mínima
- [x] 4.4 Integrar pooling y reciclado de obstáculos fuera de la zona activa
- [x] 4.5 Validar que valla exige salto, arco exige agachado y sólido exige cambio de carril

## 5. Colisiones

- [x] 5.1 Implementar `systems/CollisionSystem.ts` con solapamiento longitudinal, distancia lateral real y estado vertical
- [x] 5.2 Resolver impacto contra obstáculo: detener carrera y pasar a GAME OVER
- [x] 5.3 Validar que no hay colisiones falsas entre carriles ni durante la transición lateral

## 6. Monedas y puntuación

- [x] 6.1 Crear `entities/Coin.ts` y generarlas en patrones con pooling
- [x] 6.2 Implementar `systems/ScoreSystem.ts` con puntuación por distancia y por monedas
- [x] 6.3 Implementar `systems/SpeedSystem.ts` con aceleración progresiva entre velocidad base y máxima, y reinicio
- [x] 6.4 Actualizar el HUD con puntuación y monedas en tiempo real

## 7. Agachado, táctil y dificultad

- [x] 7.1 Implementar el agachado con reducción del perfil vertical y su exclusión mutua con el salto
- [x] 7.2 Completar los gestos táctiles (izquierda, derecha, arriba, abajo, tap) con umbrales configurados
- [x] 7.3 Aumentar progresivamente la frecuencia/complejidad de los grupos con un techo máximo
- [ ] 7.4 Validar la jugabilidad en viewport móvil

## 8. Interfaz y persistencia

- [x] 8.1 Implementar el menú principal con título, récord, instrucciones y acción de inicio
- [x] 8.2 Implementar la pantalla de pausa con reanudar y volver al menú
- [x] 8.3 Implementar la pantalla de game over con puntuación, récord, reinicio y volver al menú
- [x] 8.4 Implementar `storage/HighScore.ts` con lectura/escritura del récord en localStorage y su integración en menú y game over
- [x] 8.5 Validar el ciclo completo: menú → jugar → pausar → morir → reiniciar, conservando el récord

## 9. Dirección de arte: ilustración urbana 3D low-poly

- [x] 9.1 Definir `SKY_PALETTE`, `CITY_PALETTE` y `OUTLINE_THICKNESS` en `config.ts`
- [x] 9.2 Crear el helper `createToonMaterial` con `MeshToonMaterial` y rampa de luz discreta, y usar `flatGeometry` para el facetado low-poly; asegurar materiales mates sin reflejos
- [x] 9.3 Implementar el cielo con gradiente vertical (skyTop → skyMain → skyHorizon), nubes geométricas blanco-azuladas y niebla azul clara
- [x] 9.4 Montar la iluminación: hemisférica cielo/horizonte más direccional cálida con sombras de resolución moderada
- [x] 9.5 Implementar `addInkOutline` y aplicar grosores por tipo (jugador, coleccionable, obstáculo, NPC, prop), sin contorno en el fondo lejano
- [x] 9.6 Construir la ciudad colorida: fachadas de 3 a 6 plantas con balcones, persianas, macetas, toldos y azoteas, alternando la paleta por bloque y reduciendo saturación y detalle en distancia
- [x] 9.7 Vestir la calle: asfalto azul-gris, aceras crema y gris claro, árboles low-poly, banderines y carteles abstractos vivos
- [x] 9.8 Añadir sombras falsas planas azuladas sobre el asfalto, además de las sombras dinámicas
- [x] 9.9 Ajustar el toro (base marrón oscura, luces marrones cálidas, cuernos crema, outline marino) y los obstáculos para que destaquen frente al asfalto
- [x] 9.10 Aplicar el código de color: dorado casi exclusivo para monedas y recompensas, rojo y naranja para peligro, azul marino para contornos
- [x] 9.11 Compartir geometrías y materiales, evitar allocaciones por fotograma y ajustar el coste de las sombras

## 10. Verificación final

- [x] 10.1 Ejecutar `typecheck` y `build` sin errores
- [x] 10.2 Recorrer manualmente los escenarios de las specs y anotar cualquier desviación
- [x] 10.3 Confirmar que no se reutiliza ningún recurso, personaje o interfaz de Subway Surfers
- [ ] 10.4 Verificar los criterios de aceptación visual: cielo azul dominante, ciudad vibrante, bandas de shading, outlines legibles y profundidad por niebla
- [ ] 10.5 Comprobar el rendimiento en escritorio y móvil (pixel ratio, sombras, outlines y reciclado)
- [x] 10.6 Actualizar `README.md` con instrucciones de instalación, ejecución y controles
