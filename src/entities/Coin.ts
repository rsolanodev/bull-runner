import * as THREE from 'three';
import { CITY_PALETTE, CONFIG, OUTLINE_THICKNESS } from '../config';
import { addInkOutline, createToonMaterial, flatGeometry } from '../utils/visuals';

const geometry = flatGeometry(new THREE.TorusGeometry(0.3, 0.11, 8, 14));
const material = createToonMaterial(CITY_PALETTE.coinGold, {
  emissive: CITY_PALETTE.coinShine,
});

export class Coin {
  readonly group = new THREE.Group();
  readonly radius = CONFIG.coin.radius;
  private readonly coin: THREE.Mesh;

  constructor() {
    this.coin = new THREE.Mesh(geometry, material);
    this.coin.castShadow = true;
    addInkOutline(this.coin, OUTLINE_THICKNESS.collectible, CITY_PALETTE.coinShine);
    this.group.add(this.coin);
  }

  reset(x: number, y: number, z: number): void {
    this.group.position.set(x, y, z);
    this.group.visible = true;
  }

  update(dt: number): void {
    this.coin.rotation.y += dt * CONFIG.coin.spinSpeed;
  }
}
