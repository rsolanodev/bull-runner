function mustGet<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
}

export class HUD {
  private readonly root = mustGet('hud');
  private readonly scoreEl = mustGet('hud-score');
  private readonly coinsEl = mustGet('hud-coins');
  private readonly pauseButton = mustGet<HTMLButtonElement>('hud-pause');

  constructor(onPause: () => void) {
    this.pauseButton.addEventListener('click', onPause);
  }

  show(): void {
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }

  update(score: number, coins: number): void {
    this.scoreEl.textContent = String(score);
    this.coinsEl.textContent = String(coins);
  }
}
