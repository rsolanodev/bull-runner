export enum GameState {
  Menu = 'menu',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'gameover',
}

const TRANSITIONS: Record<GameState, readonly GameState[]> = {
  [GameState.Menu]: [GameState.Playing],
  [GameState.Playing]: [GameState.Paused, GameState.GameOver, GameState.Menu],
  [GameState.Paused]: [GameState.Playing, GameState.Menu],
  [GameState.GameOver]: [GameState.Playing, GameState.Menu],
};

export type StateChangeListener = (next: GameState, previous: GameState) => void;

export class GameStateMachine {
  private currentState: GameState = GameState.Menu;
  private readonly listeners = new Set<StateChangeListener>();

  get state(): GameState {
    return this.currentState;
  }

  is(state: GameState): boolean {
    return this.currentState === state;
  }

  canTransition(next: GameState): boolean {
    if (next === this.currentState) return false;
    return TRANSITIONS[this.currentState].includes(next);
  }

  transition(next: GameState): boolean {
    if (!this.canTransition(next)) return false;
    const previous = this.currentState;
    this.currentState = next;
    this.listeners.forEach((listener) => listener(next, previous));
    return true;
  }

  onChange(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
