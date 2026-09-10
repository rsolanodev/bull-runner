import * as THREE from 'three';
import { CITY_PALETTE, CONFIG, OUTLINE_THICKNESS, SKY_PALETTE } from '../config';
import { addInkOutline, createToonMaterial, flatGeometry } from '../utils/visuals';

export type ObstacleType = 'low' | 'arch' | 'solid';

const materials = {
  danger: createToonMaterial(CITY_PALETTE.dangerRed),
  dangerOrange: createToonMaterial(CITY_PALETTE.dangerOrange),
  terracotta: createToonMaterial(CITY_PALETTE.terracotta),
  wood: createToonMaterial(CITY_PALETTE.roof),
  cream: createToonMaterial(CITY_PALETTE.cream),
  coral: createToonMaterial(CITY_PALETTE.coral),
  turquoise: createToonMaterial(CITY_PALETTE.brightTurquoise),
  sunny: createToonMaterial(CITY_PALETTE.sunnyYellow),
  dark: createToonMaterial(SKY_PALETTE.inkNavy),
} as const;

const geometries = {
  lowBoard: new THREE.BoxGeometry(2.0, 0.42, 0.16),
  lowCap: new THREE.BoxGeometry(0.16, 0.42, 0.18),
  post: new THREE.BoxGeometry(0.14, 0.9, 0.14),
  archPost: new THREE.BoxGeometry(0.32, 2.5, 0.32),
  archBeam: new THREE.BoxGeometry(10.0, 0.5, 0.36),
  archBanner: new THREE.BoxGeometry(9.4, 0.9, 0.08),
  flag: new THREE.BoxGeometry(0.3, 0.32, 0.06),
  barrel: flatGeometry(new THREE.CylinderGeometry(0.55, 0.55, 1.3, 10)),
  band: flatGeometry(new THREE.CylinderGeometry(0.58, 0.58, 0.14, 10)),
} as const;

function part(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  outline = false,
): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = false;
  if (outline) addInkOutline(m, OUTLINE_THICKNESS.obstacle);
  return m;
}

export class Obstacle {
  readonly group = new THREE.Group();

  constructor(readonly type: ObstacleType) {
    if (type === 'low') this.buildLow();
    else if (type === 'arch') this.buildArch();
    else this.buildSolid();
  }

  private buildLow(): void {
    this.group.add(part(geometries.lowBoard, materials.sunny, 0, 0.62, 0, true));
    this.group.add(part(geometries.lowCap, materials.danger, -0.95, 0.62, 0.02));
    this.group.add(part(geometries.lowCap, materials.danger, 0.95, 0.62, 0.02));
    this.group.add(part(geometries.post, materials.wood, -0.9, 0.45, 0));
    this.group.add(part(geometries.post, materials.wood, 0.9, 0.45, 0));
  }

  private buildArch(): void {
    const side = 4.85;
    this.group.add(part(geometries.archPost, materials.cream, -side, 1.25, 0, true));
    this.group.add(part(geometries.archPost, materials.cream, side, 1.25, 0, true));
    this.group.add(part(geometries.archBeam, materials.coral, 0, 2.6, 0, true));
    this.group.add(part(geometries.archBanner, materials.turquoise, 0, 1.98, 0.05));
    for (let i = -4; i <= 4; i += 1) {
      const flag = part(
        geometries.flag,
        i % 2 === 0 ? materials.coral : materials.sunny,
        i * 1.0,
        1.5,
        0.12,
      );
      this.group.add(flag);
    }
  }

  private buildSolid(): void {
    this.group.add(part(geometries.barrel, materials.terracotta, 0, 0.65, 0, true));
    this.group.add(part(geometries.band, materials.dark, 0, 0.35, 0));
    this.group.add(part(geometries.band, materials.dangerOrange, 0, 0.95, 0));
  }

  get halfWidth(): number {
    return CONFIG.obstacles[this.type].halfWidth;
  }

  get halfLength(): number {
    return CONFIG.obstacles[this.type].halfLength;
  }

  get spansLanes(): boolean {
    return this.type === 'arch';
  }

  reset(x: number, z: number): void {
    this.group.position.set(x, 0, z);
    this.group.visible = true;
  }
}
