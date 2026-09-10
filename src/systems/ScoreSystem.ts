import { CONFIG } from '../config';

export class ScoreSystem {
  score = 0;
  coins = 0;

  addDistance(distance: number): void {
    this.score += distance * CONFIG.score.distancePerUnit;
  }

  addCoin(): void {
    this.coins += 1;
    this.score += CONFIG.score.coinValue;
  }

  get displayScore(): number {
    return Math.floor(this.score);
  }

  reset(): void {
    this.score = 0;
    this.coins = 0;
  }
}
