import { CONFIG } from '../config';

export class LaneSystem {
  private targetIndex = CONFIG.bull.startLane;
  private currentX = CONFIG.lanes.positions[CONFIG.bull.startLane];
  private previousX = this.currentX;
  private lateralSpeed = 0;

  get laneIndex(): number {
    return this.targetIndex;
  }

  get x(): number {
    return this.currentX;
  }

  get targetX(): number {
    return CONFIG.lanes.positions[this.targetIndex];
  }

  get lateralSpeedValue(): number {
    return this.lateralSpeed;
  }

  get isCentered(): boolean {
    return Math.abs(this.currentX - this.targetX) < 0.05;
  }

  moveLeft(): boolean {
    if (this.targetIndex <= 0) return false;
    this.targetIndex -= 1;
    return true;
  }

  moveRight(): boolean {
    if (this.targetIndex >= CONFIG.lanes.positions.length - 1) return false;
    this.targetIndex += 1;
    return true;
  }

  reset(): void {
    this.targetIndex = CONFIG.bull.startLane;
    this.currentX = CONFIG.lanes.positions[this.targetIndex];
    this.previousX = this.currentX;
    this.lateralSpeed = 0;
  }

  update(dt: number): void {
    this.previousX = this.currentX;
    const lambda = CONFIG.lanes.transitionSpeed;
    this.currentX =
      this.targetX + (this.currentX - this.targetX) * Math.exp(-lambda * dt);
    if (Math.abs(this.currentX - this.targetX) < 0.001) {
      this.currentX = this.targetX;
    }
    this.lateralSpeed = dt > 0 ? (this.currentX - this.previousX) / dt : 0;
  }
}
