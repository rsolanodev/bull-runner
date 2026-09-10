function mustGet<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
}

export interface ScreensCallbacks {
  onPlay: () => void;
  onResume: () => void;
  onPauseMenu: () => void;
  onRestart: () => void;
  onGameOverMenu: () => void;
}

export class Screens {
  private readonly menu = mustGet('screen-menu');
  private readonly pause = mustGet('screen-pause');
  private readonly gameOver = mustGet('screen-gameover');

  private readonly bestEl = mustGet('menu-best');
  private readonly goScore = mustGet('go-score');
  private readonly goCoins = mustGet('go-coins');
  private readonly goBest = mustGet('go-best');
  private readonly goNew = mustGet('go-new');

  constructor(callbacks: ScreensCallbacks) {
    mustGet<HTMLButtonElement>('btn-play').addEventListener('click', callbacks.onPlay);
    mustGet<HTMLButtonElement>('btn-resume').addEventListener('click', callbacks.onResume);
    mustGet<HTMLButtonElement>('btn-pause-menu').addEventListener('click', callbacks.onPauseMenu);
    mustGet<HTMLButtonElement>('btn-restart').addEventListener('click', callbacks.onRestart);
    mustGet<HTMLButtonElement>('btn-go-menu').addEventListener('click', callbacks.onGameOverMenu);
  }

  hideAll(): void {
    this.menu.classList.add('hidden');
    this.pause.classList.add('hidden');
    this.gameOver.classList.add('hidden');
  }

  showMenu(best: number): void {
    this.hideAll();
    this.bestEl.textContent = String(best);
    this.menu.classList.remove('hidden');
  }

  showPause(): void {
    this.hideAll();
    this.pause.classList.remove('hidden');
  }

  showGameOver(score: number, coins: number, best: number, isRecord: boolean): void {
    this.hideAll();
    this.goScore.textContent = String(score);
    this.goCoins.textContent = String(coins);
    this.goBest.textContent = String(best);
    this.goNew.classList.toggle('hidden', !isRecord);
    this.gameOver.classList.remove('hidden');
  }
}
