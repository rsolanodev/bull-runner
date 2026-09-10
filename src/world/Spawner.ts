import * as THREE from 'three';
import { CONFIG } from '../config';
import type { Coin } from '../entities/Coin';
import type { Obstacle, ObstacleType } from '../entities/Obstacle';
import { Coin as CoinEntity } from '../entities/Coin';
import { Obstacle as ObstacleEntity } from '../entities/Obstacle';
import { Pool } from '../utils/Pool';

const LANES = CONFIG.lanes.positions;
const OBSTACLE_TYPES: ObstacleType[] = ['low', 'solid'];

export class Spawner {
  readonly group = new THREE.Group();
  readonly activeObstacles: Obstacle[] = [];
  readonly activeCoins: Coin[] = [];

  private readonly obstaclePools: Record<ObstacleType, Pool<Obstacle>>;
  private readonly coinPool: Pool<Coin>;
  private distanceSinceSpawn = 0;
  private nextGapDistance = 0;

  constructor(scene: THREE.Scene) {
    const perType = Math.ceil(CONFIG.pools.obstacles / 2);
    this.obstaclePools = {
      low: new Pool(() => new ObstacleEntity('low'), perType),
      solid: new Pool(() => new ObstacleEntity('solid'), perType),
      arch: new Pool(() => new ObstacleEntity('arch'), Math.ceil(perType / 2)),
    };
    this.coinPool = new Pool(() => new CoinEntity(), CONFIG.pools.coins);
    scene.add(this.group);
  }

  reset(): void {
    for (const obstacle of [...this.activeObstacles]) {
      this.releaseObstacle(obstacle);
    }
    for (const coin of [...this.activeCoins]) {
      this.releaseCoin(coin);
    }
    this.activeObstacles.length = 0;
    this.activeCoins.length = 0;
    this.distanceSinceSpawn = 0;
    this.nextGapDistance = CONFIG.speed.base * CONFIG.spawn.gapTimeStart;
  }

  update(dt: number, distance: number, speed: number, difficulty: number): void {
    for (let i = this.activeObstacles.length - 1; i >= 0; i -= 1) {
      const obstacle = this.activeObstacles[i];
      obstacle.group.position.z += distance;
      if (obstacle.group.position.z > CONFIG.spawn.recycleZ) {
        this.releaseObstacle(obstacle);
        this.activeObstacles.splice(i, 1);
      }
    }

    for (let i = this.activeCoins.length - 1; i >= 0; i -= 1) {
      const coin = this.activeCoins[i];
      coin.group.position.z += distance;
      coin.update(dt);
      if (coin.group.position.z > CONFIG.spawn.recycleZ) {
        this.releaseCoin(coin);
        this.activeCoins.splice(i, 1);
      }
    }

    this.distanceSinceSpawn += distance;
    if (this.distanceSinceSpawn >= this.nextGapDistance) {
      this.distanceSinceSpawn = 0;
      const gapTime =
        CONFIG.spawn.gapTimeStart +
        (CONFIG.spawn.gapTimeMin - CONFIG.spawn.gapTimeStart) * difficulty;
      this.nextGapDistance = speed * gapTime;
      this.spawnPattern(difficulty);
    }
  }

  private spawnPattern(difficulty: number): void {
    const roll = Math.random();

    if (difficulty < 0.33) {
      if (roll < 0.55) this.spawnSingle();
      else this.spawnArch();
      return;
    }
    if (difficulty < 0.66) {
      if (roll < 0.45) this.spawnSingle();
      else if (roll < 0.8) this.spawnTwoLanes();
      else this.spawnArch();
      return;
    }
    if (roll < 0.3) this.spawnSingle();
    else if (roll < 0.58) this.spawnTwoLanes();
    else if (roll < 0.78) this.spawnAllLow();
    else this.spawnArch();
  }

  private spawnSingle(): void {
    const lane = Math.floor(Math.random() * LANES.length);
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    this.spawnObstacle(type, LANES[lane]);
    const freeLanes = LANES.filter((_, i) => i !== lane);
    this.spawnCoins(this.pick(freeLanes), false);
  }

  private spawnTwoLanes(): void {
    const indices = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, 2);
    for (const index of indices) {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      this.spawnObstacle(type, LANES[index]);
    }
    const freeIndex = [0, 1, 2].find((i) => !indices.includes(i)) ?? 1;
    this.spawnCoins(LANES[freeIndex], false);
  }

  private spawnAllLow(): void {
    for (const lane of LANES) {
      this.spawnObstacle('low', lane);
    }
    this.spawnCoins(LANES[Math.floor(Math.random() * LANES.length)], true);
  }

  private spawnArch(): void {
    this.spawnObstacle('arch', 0);
    this.spawnCoins(LANES[Math.floor(Math.random() * LANES.length)], false, 5.5);
  }

  private spawnObstacle(type: ObstacleType, x: number): void {
    const obstacle = this.obstaclePools[type].acquire();
    if (!obstacle.group.parent) this.group.add(obstacle.group);
    obstacle.reset(x, -CONFIG.spawn.distanceAhead);
    this.activeObstacles.push(obstacle);
  }

  private spawnCoins(x: number, elevated: boolean, zOffset = 0): void {
    if (Math.random() > CONFIG.spawn.coinChance) return;
    const count =
      CONFIG.spawn.coinRunMin +
      Math.floor(Math.random() * (CONFIG.spawn.coinRunMax - CONFIG.spawn.coinRunMin + 1));
    const y = elevated ? 1.75 : CONFIG.coin.height;
    for (let i = 0; i < count; i += 1) {
      const coin = this.coinPool.acquire();
      if (!coin.group.parent) this.group.add(coin.group);
      coin.reset(
        x,
        y,
        -CONFIG.spawn.distanceAhead + zOffset + i * CONFIG.spawn.coinSpacing,
      );
      this.activeCoins.push(coin);
    }
  }

  collectCoin(coin: Coin): void {
    const index = this.activeCoins.indexOf(coin);
    if (index >= 0) this.activeCoins.splice(index, 1);
    this.releaseCoin(coin);
  }

  private releaseObstacle(obstacle: Obstacle): void {
    obstacle.group.visible = false;
    obstacle.group.position.z = 1000;
    this.obstaclePools[obstacle.type].release(obstacle);
  }

  private releaseCoin(coin: Coin): void {
    coin.group.visible = false;
    coin.group.position.z = 1000;
    this.coinPool.release(coin);
  }

  private pick<T>(values: T[]): T {
    return values[Math.floor(Math.random() * values.length)];
  }
}
