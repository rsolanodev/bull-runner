import * as THREE from 'three';
import { CITY_PALETTE, CONFIG, SKY_PALETTE } from '../config';
import { createToonMaterial, flatGeometry } from '../utils/visuals';

const facadeMaterials = [
  createToonMaterial(CITY_PALETTE.cream),
  createToonMaterial(CITY_PALETTE.sunnyYellow),
  createToonMaterial(CITY_PALETTE.coral),
  createToonMaterial(CITY_PALETTE.vividPink),
  createToonMaterial(CITY_PALETTE.brightTurquoise),
  createToonMaterial(CITY_PALETTE.freshMint),
  createToonMaterial(CITY_PALETTE.lavender),
  createToonMaterial(CITY_PALETTE.clearBlue),
];

const shared = {
  road: createToonMaterial(CITY_PALETTE.road),
  sidewalk: createToonMaterial(CITY_PALETTE.sidewalk),
  curb: createToonMaterial(CITY_PALETTE.curb),
  roof: createToonMaterial(CITY_PALETTE.roof),
  window: createToonMaterial(CITY_PALETTE.windows),
  trunk: createToonMaterial(CITY_PALETTE.trunk),
  leaf: createToonMaterial(CITY_PALETTE.tree),
  leafLight: createToonMaterial(CITY_PALETTE.treeLight),
  shadow: createToonMaterial(SKY_PALETTE.shadowBlue),
  bannerA: createToonMaterial(CITY_PALETTE.coral),
  bannerB: createToonMaterial(CITY_PALETTE.sunnyYellow),
  bannerC: createToonMaterial(CITY_PALETTE.brightTurquoise),
};

const geo = {
  window: new THREE.BoxGeometry(0.12, 0.95, 0.7),
  trunk: flatGeometry(new THREE.CylinderGeometry(0.18, 0.24, 1.6, 6)),
  leaf: new THREE.IcosahedronGeometry(1.15, 0),
  flag: new THREE.BoxGeometry(0.34, 0.42, 0.06),
  shadow: new THREE.PlaneGeometry(4, 4),
};

const SIDEWALK_INNER = CONFIG.world.roadHalfWidth;
const SIDEWALK_OUTER = SIDEWALK_INNER + CONFIG.world.sidewalkWidth;

function pickFacade(): THREE.Material {
  return facadeMaterials[Math.floor(Math.random() * facadeMaterials.length)];
}

function flatShadowMesh(): THREE.Mesh {
  const material = shared.shadow.clone();
  material.transparent = true;
  material.opacity = 0.16;
  material.depthWrite = false;
  const mesh = new THREE.Mesh(geo.shadow, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  return mesh;
}

class Segment {
  readonly group = new THREE.Group();
  private readonly buildings: THREE.Mesh[] = [];
  private readonly buildingDepth: number[] = [];

  constructor(index: number) {
    this.buildRoad();
    this.buildSidewalks();
    this.buildBuildings();
    this.buildTrees();
    this.buildShadows();
    if (index % 2 === 0) this.buildBunting();
    if (index % 3 === 0) this.buildCrosswalk();
  }

  private buildRoad(): void {
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(CONFIG.world.roadHalfWidth * 2, CONFIG.world.segmentLength),
      shared.road,
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    road.receiveShadow = true;
    this.group.add(road);
  }

  private buildSidewalks(): void {
    const length = CONFIG.world.segmentLength;
    for (const side of [-1, 1]) {
      const walk = new THREE.Mesh(
        new THREE.BoxGeometry(CONFIG.world.sidewalkWidth, 0.24, length),
        shared.sidewalk,
      );
      walk.position.set(side * (SIDEWALK_INNER + CONFIG.world.sidewalkWidth / 2), 0.12, 0);
      walk.receiveShadow = true;
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, length), shared.curb);
      curb.position.set(side * SIDEWALK_INNER, 0.17, 0);
      curb.receiveShadow = true;
      this.group.add(walk, curb);
    }
  }

  private buildBuildings(): void {
    const length = CONFIG.world.segmentLength;
    const slots = [-length * 0.3, length * 0.12, length * 0.42];
    for (const side of [-1, 1]) {
      for (const slot of slots) {
        if (Math.random() < 0.18) continue;
        const depth = 6 + Math.random() * 5;
        const width = 8 + Math.random() * 5;
        const height = 9 + Math.random() * 12;

        const building = new THREE.Mesh(
          new THREE.BoxGeometry(depth, height, width),
          pickFacade(),
        );
        building.position.set(side * (SIDEWALK_OUTER + depth / 2), height / 2, slot);
        building.castShadow = true;
        building.receiveShadow = true;
        this.group.add(building);
        this.buildings.push(building);
        this.buildingDepth.push(depth);

        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(depth + 0.4, 0.4, width + 0.4),
          shared.roof,
        );
        roof.position.set(building.position.x, height + 0.2, slot);
        this.group.add(roof);

        this.buildWindows(side, building.position.x, depth, width, height, slot);
      }
    }
  }

  private buildWindows(
    side: number,
    centerX: number,
    depth: number,
    width: number,
    height: number,
    slot: number,
  ): void {
    const faceX = centerX - side * (depth / 2 + 0.05);
    const rows = Math.max(1, Math.min(3, Math.floor(height / 4)));
    const cols = Math.max(1, Math.min(2, Math.floor(width / 4)));
    for (let r = 0; r < rows; r += 1) {
      const y = 2.2 + r * ((height - 2.5) / rows);
      for (let c = 0; c < cols; c += 1) {
        const z = slot + (c - (cols - 1) / 2) * (width / (cols + 0.4));
        const win = new THREE.Mesh(geo.window, shared.window);
        win.position.set(faceX, y, z);
        this.group.add(win);
      }
    }
  }

  private buildTrees(): void {
    if (Math.random() < 0.35) return;
    for (const side of [-1, 1]) {
      if (Math.random() < 0.35) continue;
      const z = (Math.random() - 0.5) * CONFIG.world.segmentLength * 0.7;
      const x = side * (SIDEWALK_INNER + 1.3);
      const trunk = new THREE.Mesh(geo.trunk, shared.trunk);
      trunk.position.set(x, 0.9, z);
      trunk.castShadow = true;
      const foliage = new THREE.Mesh(geo.leaf, Math.random() < 0.5 ? shared.leaf : shared.leafLight);
      foliage.position.set(x, 2.3, z);
      foliage.castShadow = true;
      this.group.add(trunk, foliage);
    }
  }

  private buildShadows(): void {
    for (let i = 0; i < 3; i += 1) {
      const shadow = flatShadowMesh();
      shadow.position.x = (Math.random() - 0.5) * CONFIG.world.roadHalfWidth * 1.6;
      shadow.position.z = (Math.random() - 0.5) * CONFIG.world.segmentLength * 0.8;
      shadow.scale.set(0.7 + Math.random(), 0.7 + Math.random(), 1);
      this.group.add(shadow);
    }
  }

  private buildBunting(): void {
    const bannerMats = [shared.bannerA, shared.bannerB, shared.bannerC];
    for (let i = -6; i <= 6; i += 1) {
      const flag = new THREE.Mesh(geo.flag, bannerMats[Math.abs(i) % bannerMats.length]);
      flag.position.set(i * 1.05, 5.2 + Math.cos(i * 0.5) * 0.25, 0);
      this.group.add(flag);
    }
    const rope = new THREE.Mesh(
      new THREE.BoxGeometry(13.6, 0.06, 0.06),
      shared.bannerA,
    );
    rope.position.set(0, 5.45, 0);
    this.group.add(rope);
  }

  private buildCrosswalk(): void {
    for (let i = -3; i <= 3; i += 1) {
      const stripe = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, CONFIG.world.roadHalfWidth * 2 * 0.96),
        createToonMaterial(CITY_PALETTE.crosswalk),
      );
      stripe.rotation.x = -Math.PI / 2;
      stripe.rotation.z = Math.PI / 2;
      stripe.position.set(0, 0.02, i * 1.2 - CONFIG.world.segmentLength * 0.36);
      this.group.add(stripe);
    }
  }

  recolor(): void {
    this.buildings.forEach((building, i) => {
      building.material = pickFacade();
      void this.buildingDepth[i];
    });
  }
}

export class SegmentManager {
  readonly group = new THREE.Group();
  private readonly segments: Segment[] = [];
  private readonly totalLength: number;

  constructor() {
    const { segmentCount, segmentLength } = CONFIG.world;
    this.totalLength = segmentCount * segmentLength;
    for (let i = 0; i < segmentCount; i += 1) {
      const segment = new Segment(i);
      segment.group.position.z = -i * segmentLength;
      this.segments.push(segment);
      this.group.add(segment.group);
    }
  }

  update(distance: number): void {
    for (const segment of this.segments) {
      segment.group.position.z += distance;
      if (segment.group.position.z > CONFIG.spawn.recycleZ) {
        segment.group.position.z -= this.totalLength;
        segment.recolor();
      }
    }
  }

  reset(): void {
    const { segmentLength } = CONFIG.world;
    this.segments.forEach((segment, i) => {
      segment.group.position.z = -i * segmentLength;
    });
  }
}
