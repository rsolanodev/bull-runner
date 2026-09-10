import { CONFIG } from '../config';
import { Bull } from '../entities/Bull';
import { Input, type Intent } from './Input';
import { Loop } from './Loop';
import { Renderer } from './Renderer';
import { HighScore } from '../storage/HighScore';
import { GameState, GameStateMachine } from '../state/GameState';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { SpeedSystem } from '../systems/SpeedSystem';
import { HUD } from '../ui/HUD';
import { Screens } from '../ui/Screens';
import { Spawner } from '../world/Spawner';
import { World } from '../world/World';

export class Game {
  private readonly renderer: Renderer;
  private readonly world: World;
  private readonly bull: Bull;
  private readonly spawner: Spawner;
  private readonly collision = new CollisionSystem();
  private readonly score = new ScoreSystem();
  private readonly speed = new SpeedSystem();
  private readonly highScore = new HighScore();
  private readonly hud: HUD;
  private readonly screens: Screens;
  private readonly state = new GameStateMachine();
  private readonly input: Input;
  private readonly loop = new Loop((dt) => this.update(dt));

  private cameraX = 0;
  private cameraTilt = 0;
  private shake = 0;

  constructor(container: HTMLElement) {
    this.renderer = new Renderer(container);
    this.world = new World(this.renderer.scene, this.renderer.camera);
    this.bull = new Bull();
    this.bull.addTo(this.renderer.scene);
    this.spawner = new Spawner(this.renderer.scene);

    this.hud = new HUD(() => this.togglePause());
    this.screens = new Screens({
      onPlay: () => this.startGame(),
      onResume: () => this.resume(),
      onPauseMenu: () => this.toMenu(),
      onRestart: () => this.startGame(),
      onGameOverMenu: () => this.toMenu(),
    });

    this.input = new Input(container, (intent) => this.handleIntent(intent));

    this.screens.showMenu(this.highScore.current);
    this.hud.hide();

    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('blur', this.onWindowBlur);
  }

  start(): void {
    this.loop.start();
  }

  private startGame(): void {
    this.blurActiveElement();
    this.score.reset();
    this.speed.reset();
    this.spawner.reset();
    this.bull.reset();
    this.world.reset();
    this.cameraX = 0;
    this.cameraTilt = 0;
    this.shake = 0;
    this.hud.update(0, 0);
    this.hud.show();
    this.screens.hideAll();
    this.state.transition(GameState.Playing);
  }

  private pause(): void {
    if (!this.state.is(GameState.Playing)) return;
    if (this.state.transition(GameState.Paused)) {
      this.screens.showPause();
      this.hud.hide();
    }
  }

  private resume(): void {
    if (!this.state.is(GameState.Paused)) return;
    if (this.state.transition(GameState.Playing)) {
      this.screens.hideAll();
      this.hud.show();
    }
  }

  private togglePause(): void {
    if (this.state.is(GameState.Playing)) this.pause();
    else if (this.state.is(GameState.Paused)) this.resume();
  }

  private toMenu(): void {
    this.spawner.reset();
    this.bull.reset();
    this.world.reset();
    this.cameraX = 0;
    this.cameraTilt = 0;
    this.state.transition(GameState.Menu);
    this.hud.hide();
    this.screens.showMenu(this.highScore.current);
  }

  private gameOver(): void {
    if (!this.state.transition(GameState.GameOver)) return;
    const finalScore = this.score.displayScore;
    const isRecord = this.highScore.submit(finalScore);
    this.shake = 0.7;
    this.hud.hide();
    this.screens.showGameOver(finalScore, this.score.coins, this.highScore.current, isRecord);
  }

  private handleIntent(intent: Intent): void {
    switch (this.state.state) {
      case GameState.Menu:
        if (intent === 'confirm' || intent === 'jump') this.startGame();
        break;
      case GameState.Playing:
        if (intent === 'left') this.bull.moveLeft();
        else if (intent === 'right') this.bull.moveRight();
        else if (intent === 'jump') this.bull.jump();
        else if (intent === 'slide') this.bull.slide();
        else if (intent === 'pause') this.pause();
        break;
      case GameState.Paused:
        if (intent === 'pause' || intent === 'confirm') this.resume();
        break;
      case GameState.GameOver:
        if (intent === 'confirm' || intent === 'jump') this.startGame();
        break;
    }
  }

  private update(dt: number): void {
    if (this.state.is(GameState.Playing)) {
      this.speed.update(dt);
      const distance = this.speed.speed * dt;

      this.world.update(dt, distance);
      this.spawner.update(dt, distance, this.speed.speed, this.speed.difficulty);
      this.bull.update(dt, this.speed.speed, true);

      const result = this.collision.check(
        this.bull,
        this.spawner.activeObstacles,
        this.spawner.activeCoins,
      );

      for (const coin of result.collected) {
        this.score.addCoin();
        this.spawner.collectCoin(coin);
      }
      this.score.addDistance(distance);
      this.hud.update(this.score.displayScore, this.score.coins);

      if (result.hit) this.gameOver();
    } else if (this.state.is(GameState.Menu)) {
      const distance = CONFIG.speed.base * 0.45 * dt;
      this.world.update(dt, distance);
      this.bull.update(dt, CONFIG.speed.base, true);
    }

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * CONFIG.camera.shakeDecay);

    this.updateCamera(dt);
    this.renderer.render();
  }

  private updateCamera(dt: number): void {
    const smooth = Math.min(1, dt * CONFIG.camera.damping);
    const targetX = this.bull.x * CONFIG.camera.lateralFollow;
    this.cameraX += (targetX - this.cameraX) * smooth;

    const targetTilt = -this.bull.lane.lateralSpeedValue * CONFIG.camera.tiltFactor;
    this.cameraTilt += (targetTilt - this.cameraTilt) * smooth;

    const shakeX = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;

    this.renderer.camera.position.set(
      this.cameraX + shakeX,
      CONFIG.camera.height + shakeY,
      CONFIG.camera.distance,
    );
    this.renderer.camera.lookAt(
      this.bull.x * 0.5,
      CONFIG.camera.lookHeight,
      -CONFIG.camera.lookAhead,
    );
    this.renderer.camera.rotation.z += this.cameraTilt;
  }

  private blurActiveElement(): void {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) this.pause();
  };

  private readonly onWindowBlur = (): void => {
    this.pause();
  };

  dispose(): void {
    this.loop.stop();
    this.input.dispose();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('blur', this.onWindowBlur);
    this.renderer.dispose();
  }
}
