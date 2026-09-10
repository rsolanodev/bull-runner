import { CONFIG } from '../config';
import type { Bull } from '../entities/Bull';
import type { Coin } from '../entities/Coin';
import type { Obstacle } from '../entities/Obstacle';

export interface CollisionResult {
  hit: boolean;
  collected: Coin[];
}

const COIN_COLLECT_RADIUS = 1.15;

export class CollisionSystem {
  check(bull: Bull, obstacles: Obstacle[], coins: Coin[]): CollisionResult {
    const collected: Coin[] = [];
    const bullCenterY = bull.y + CONFIG.bull.standingHeight * 0.55;

    for (const coin of coins) {
      if (!coin.group.visible) continue;
      const dx = coin.group.position.x - bull.x;
      const dy = coin.group.position.y - bullCenterY;
      const dz = coin.group.position.z;
      if (dx * dx + dy * dy + dz * dz <= COIN_COLLECT_RADIUS * COIN_COLLECT_RADIUS) {
        collected.push(coin);
      }
    }

    let hit = false;
    for (const obstacle of obstacles) {
      if (!obstacle.group.visible) continue;

      const zOverlap =
        Math.abs(obstacle.group.position.z) < obstacle.halfLength + bull.halfLength;
      if (!zOverlap) continue;

      if (obstacle.spansLanes) {
        if (!bull.isSliding) {
          hit = true;
          break;
        }
        continue;
      }

      const xOverlap =
        Math.abs(obstacle.group.position.x - bull.x) <
        obstacle.halfWidth + bull.halfWidth;
      if (!xOverlap) continue;

      if (obstacle.type === 'low') {
        if (bull.y < CONFIG.obstacles.low.clearance) {
          hit = true;
          break;
        }
      } else {
        hit = true;
        break;
      }
    }

    return { hit, collected };
  }
}
