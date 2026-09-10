import { CONFIG } from '../config';

export class HighScore {
  private value: number;

  constructor() {
    this.value = this.load();
  }

  get current(): number {
    return this.value;
  }

  submit(score: number): boolean {
    if (score <= this.value) return false;
    this.value = score;
    this.save();
    return true;
  }

  private load(): number {
    try {
      const raw = window.localStorage.getItem(CONFIG.storage.highScoreKey);
      const parsed = raw ? Number.parseInt(raw, 10) : 0;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch {
      return 0;
    }
  }

  private save(): void {
    try {
      window.localStorage.setItem(CONFIG.storage.highScoreKey, String(this.value));
    } catch {
      // storage unavailable; keep in-memory value only
    }
  }
}
