import * as THREE from 'three';
import { BULL_PALETTE, CONFIG, OUTLINE_THICKNESS } from '../config';
import {
  addInkOutline,
  createFlatShadow,
  createToonMaterial,
  flatGeometry,
} from '../utils/visuals';
import { LaneSystem } from '../world/LaneSystem';

const materials = {
  body: createToonMaterial(BULL_PALETTE.body),
  bodyLight: createToonMaterial(BULL_PALETTE.bodyLight),
  belly: createToonMaterial(BULL_PALETTE.belly),
  horn: createToonMaterial(BULL_PALETTE.horn),
  hoof: createToonMaterial(BULL_PALETTE.hoof),
  eye: createToonMaterial(BULL_PALETTE.eye),
  pupil: createToonMaterial(BULL_PALETTE.pupil),
  nose: createToonMaterial(BULL_PALETTE.nose),
} as const;

function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  outline = false,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  if (outline) addInkOutline(m, OUTLINE_THICKNESS.player);
  return m;
}

export class Bull {
  readonly group = new THREE.Group();
  readonly shadow: THREE.Mesh;
  readonly lane = new LaneSystem();

  y = 0;
  isJumping = false;
  isSliding = false;

  private vy = 0;
  private slideTimer = 0;
  private runPhase = 0;
  private slideBlend = 0;
  private readonly visual = new THREE.Group();
  private readonly legPivots: THREE.Group[] = [];

  constructor() {
    this.group.add(this.visual);
    this.buildBody();
    this.buildLegs();

    this.shadow = createFlatShadow(1.05);
    this.shadow.position.y = 0.03;
  }

  private buildBody(): void {
    this.visual.add(box(1.3, 1.0, 2.1, materials.body, 0, 1.08, 0, true));
    this.visual.add(box(1.12, 0.5, 1.7, materials.belly, 0, 0.78, 0.05));
    this.visual.add(box(0.92, 0.85, 0.95, materials.body, 0, 1.38, -1.22, true));
    this.visual.add(box(0.58, 0.46, 0.38, materials.nose, 0, 1.16, -1.78));
    this.visual.add(box(0.5, 0.16, 0.5, materials.bodyLight, 0, 1.86, -1.15));

    const hornGeo = flatGeometry(new THREE.ConeGeometry(0.13, 0.52, 6));
    const hornLeft = new THREE.Mesh(hornGeo, materials.horn);
    hornLeft.position.set(-0.42, 1.9, -1.05);
    hornLeft.rotation.z = 0.5;
    hornLeft.castShadow = true;
    addInkOutline(hornLeft, OUTLINE_THICKNESS.player);
    const hornRight = hornLeft.clone();
    hornRight.position.x = 0.42;
    hornRight.rotation.z = -0.5;
    this.visual.add(hornLeft, hornRight);

    for (const side of [-1, 1]) {
      this.visual.add(box(0.2, 0.24, 0.16, materials.eye, side * 0.34, 1.52, -1.62));
      this.visual.add(box(0.1, 0.14, 0.1, materials.pupil, side * 0.34, 1.5, -1.72));
    }

    const tail = box(0.12, 0.55, 0.12, materials.bodyLight, 0, 1.35, 1.08);
    tail.rotation.x = -0.5;
    this.visual.add(tail);
  }

  private buildLegs(): void {
    const legGeometry = new THREE.BoxGeometry(0.26, 0.9, 0.26);
    const hoofGeometry = new THREE.BoxGeometry(0.3, 0.18, 0.34);
    const positions: Array<[number, number, number]> = [
      [-0.44, -0.65, 0],
      [0.44, -0.65, Math.PI],
      [-0.44, 0.62, Math.PI],
      [0.44, 0.62, 0],
    ];
    for (const [x, z, offset] of positions) {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.85, z);
      const leg = new THREE.Mesh(legGeometry, materials.body);
      leg.position.y = -0.45;
      leg.castShadow = true;
      const hoof = new THREE.Mesh(hoofGeometry, materials.hoof);
      hoof.position.y = -0.86;
      leg.add(hoof);
      pivot.add(leg);
      (pivot as THREE.Group & { gaitOffset?: number }).gaitOffset = offset;
      this.visual.add(pivot);
      this.legPivots.push(pivot);
    }
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group, this.shadow);
  }

  get x(): number {
    return this.lane.x;
  }

  get isAirborne(): boolean {
    return this.y > 0.01;
  }

  get halfWidth(): number {
    return CONFIG.bull.bodyHalfWidth;
  }

  get halfLength(): number {
    return CONFIG.bull.bodyHalfLength;
  }

  get height(): number {
    return this.isSliding
      ? CONFIG.bull.slidingHeight
      : CONFIG.bull.standingHeight;
  }

  jump(): boolean {
    if (this.isJumping || this.isSliding) return false;
    this.isJumping = true;
    this.vy = Math.sqrt(2 * CONFIG.jump.gravity * CONFIG.jump.height);
    return true;
  }

  slide(): boolean {
    if (this.isJumping || this.isSliding) return false;
    this.isSliding = true;
    this.slideTimer = CONFIG.slide.duration;
    return true;
  }

  moveLeft(): boolean {
    return this.lane.moveLeft();
  }

  moveRight(): boolean {
    return this.lane.moveRight();
  }

  reset(): void {
    this.lane.reset();
    this.y = 0;
    this.vy = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.slideTimer = 0;
    this.slideBlend = 0;
    this.runPhase = 0;
    this.applyTransform();
  }

  update(dt: number, speed: number, running: boolean): void {
    this.lane.update(dt);

    if (this.isJumping) {
      this.y += this.vy * dt;
      this.vy -= CONFIG.jump.gravity * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isJumping = false;
      }
    } else {
      this.y = 0;
    }

    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.slideTimer = 0;
      }
    }

    this.slideBlend += ((this.isSliding ? 1 : 0) - this.slideBlend) * Math.min(1, dt * 14);

    if (running) {
      this.runPhase += dt * (6 + speed * 0.55);
    }

    this.animate(running);
    this.applyTransform();
  }

  private animate(running: boolean): void {
    const airborne = this.isJumping;
    for (const pivot of this.legPivots) {
      const offset = (pivot as THREE.Group & { gaitOffset?: number }).gaitOffset ?? 0;
      let target: number;
      if (airborne) {
        target = pivot.position.z < 0 ? 0.7 : -0.5;
      } else if (this.isSliding) {
        target = 0.9;
      } else if (running) {
        target = Math.sin(this.runPhase + offset) * 0.65;
      } else {
        target = 0;
      }
      pivot.rotation.x += (target - pivot.rotation.x) * 0.35;
    }

    const bob =
      running && !airborne && !this.isSliding
        ? Math.abs(Math.sin(this.runPhase * 2)) * 0.06
        : 0;
    this.visual.position.y = bob;
    this.visual.rotation.x = this.slideBlend * 0.45;
    this.visual.scale.y = 1 - this.slideBlend * 0.5;
  }

  private applyTransform(): void {
    this.group.position.set(this.lane.x, this.y, 0);

    this.shadow.position.x = this.lane.x;
    const shrink = Math.max(0.45, 1 - this.y * 0.16);
    this.shadow.scale.setScalar(shrink);
    const opacity = Math.max(0.06, 0.22 - this.y * 0.03);
    (this.shadow.material as THREE.MeshBasicMaterial).opacity = opacity;
  }
}
