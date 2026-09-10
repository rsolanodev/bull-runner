import './style.css';
import { Game } from './core/Game';

const container = document.getElementById('game');
if (!container) {
  throw new Error('No se encontró el contenedor #game');
}

const game = new Game(container);
game.start();

const rotateHint = document.getElementById('rotate-hint');
function updateRotateHint(): void {
  if (!rotateHint) return;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const portrait = window.innerHeight > window.innerWidth;
  rotateHint.classList.toggle('hidden', !(coarse && portrait));
}

window.addEventListener('resize', updateRotateHint);
window.addEventListener('orientationchange', updateRotateHint);
updateRotateHint();

if (import.meta.hot) {
  import.meta.hot.dispose(() => game.dispose());
}
