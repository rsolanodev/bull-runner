export type UpdateFn = (deltaTime: number) => void;

export class Loop {
  private running = false;
  private lastTime = 0;
  private rafId = 0;
  private readonly maxDelta: number;

  constructor(
    private readonly update: UpdateFn,
    maxDeltaSeconds = 1 / 30,
  ) {
    this.maxDelta = maxDeltaSeconds;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  get isRunning(): boolean {
    return this.running;
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;
    let delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (delta < 0) delta = 0;
    if (delta > this.maxDelta) delta = this.maxDelta;
    this.update(delta);
    this.rafId = requestAnimationFrame(this.tick);
  };
}
