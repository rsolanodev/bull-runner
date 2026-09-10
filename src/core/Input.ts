import { CONFIG } from '../config';

export type Intent = 'left' | 'right' | 'jump' | 'slide' | 'pause' | 'confirm';
export type IntentHandler = (intent: Intent) => void;

const KEY_MAP: Record<string, Intent> = {
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
  ArrowUp: 'jump',
  w: 'jump',
  W: 'jump',
  ' ': 'jump',
  ArrowDown: 'slide',
  s: 'slide',
  S: 'slide',
  p: 'pause',
  P: 'pause',
  Escape: 'pause',
  Enter: 'confirm',
};

export class Input {
  private readonly element: HTMLElement;
  private readonly handler: IntentHandler;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private tracking = false;

  constructor(element: HTMLElement, handler: IntentHandler) {
    this.element = element;
    this.handler = handler;

    window.addEventListener('keydown', this.onKeyDown);
    this.element.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.element.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.onTouchEnd, { passive: false });
    this.element.addEventListener('touchcancel', this.onTouchCancel);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    this.element.removeEventListener('touchstart', this.onTouchStart);
    this.element.removeEventListener('touchmove', this.onTouchMove);
    this.element.removeEventListener('touchend', this.onTouchEnd);
    this.element.removeEventListener('touchcancel', this.onTouchCancel);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
      if (event.key === ' ' || event.key === 'Enter') return;
    }
    const intent = KEY_MAP[event.key];
    if (!intent) return;
    if (event.key.startsWith('Arrow') || event.key === ' ') event.preventDefault();
    if (event.repeat) return;
    this.handler(intent);
  };

  private readonly onTouchStart = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    this.tracking = true;
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = performance.now();
  };

  private readonly onTouchMove = (event: TouchEvent): void => {
    if (event.cancelable) event.preventDefault();
  };

  private readonly onTouchEnd = (event: TouchEvent): void => {
    if (!this.tracking) return;
    this.tracking = false;
    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;
    const elapsed = performance.now() - this.touchStartTime;
    const threshold = CONFIG.input.swipeThreshold;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (elapsed <= CONFIG.input.tapMaxTime && absX < threshold && absY < threshold) {
      this.handler('jump');
      return;
    }
    if (elapsed > CONFIG.input.swipeMaxTime) return;

    if (absX > absY) {
      if (absX >= threshold) this.handler(dx < 0 ? 'left' : 'right');
    } else if (absY >= threshold) {
      this.handler(dy < 0 ? 'jump' : 'slide');
    }
  };

  private readonly onTouchCancel = (): void => {
    this.tracking = false;
  };
}
