import { CONFIG } from '../config';

export class SpeedSystem {
  speed: number = CONFIG.speed.base;
  private travelled = 0;

  update(dt: number): void {
    this.speed = Math.min(CONFIG.speed.max, this.speed + CONFIG.speed.acceleration * dt);
    this.travelled += this.speed * dt;
  }

  get difficulty(): number {
    return Math.min(1, this.travelled / CONFIG.spawn.difficultyDistance);
  }

  get travelledDistance(): number {
    return this.travelled;
  }

  reset(): void {
    this.speed = CONFIG.speed.base;
    this.travelled = 0;
  }
}
