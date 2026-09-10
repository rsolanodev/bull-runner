import * as THREE from 'three';
import { CONFIG, SKY_PALETTE } from '../config';
import { createToonMaterial } from '../utils/visuals';
import { SegmentManager } from './SegmentManager';

const skyVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 mainColor;
  uniform vec3 horizonColor;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition - cameraPosition).y;
    float t = clamp(h, 0.0, 1.0);
    vec3 color = mix(horizonColor, mainColor, smoothstep(0.0, 0.45, t));
    color = mix(color, topColor, smoothstep(0.35, 0.95, t));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export class World {
  readonly segments = new SegmentManager();
  readonly group = new THREE.Group();

  private readonly sky: THREE.Mesh;
  private readonly clouds = new THREE.Group();
  private readonly sun: THREE.DirectionalLight;

  constructor(scene: THREE.Scene, private readonly camera: THREE.PerspectiveCamera) {
    scene.fog = new THREE.Fog(
      SKY_PALETTE.atmosphericFog,
      CONFIG.fog.near,
      CONFIG.fog.far,
    );

    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(420, 24, 16),
      new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(SKY_PALETTE.skyTop) },
          mainColor: { value: new THREE.Color(SKY_PALETTE.skyMain) },
          horizonColor: { value: new THREE.Color(SKY_PALETTE.skyHorizon) },
        },
        vertexShader: skyVertexShader,
        fragmentShader: skyFragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    );
    this.sky.renderOrder = -10;

    this.buildClouds();

    const hemisphereLight = new THREE.HemisphereLight(
      SKY_PALETTE.skyHorizon,
      '#4B746B',
      2.3,
    );

    this.sun = new THREE.DirectionalLight(SKY_PALETTE.sunLight, 2.8);
    this.sun.position.set(-20, 32, 20);
    this.sun.castShadow = CONFIG.render.shadows;
    this.sun.shadow.mapSize.set(
      CONFIG.render.shadowMapSize,
      CONFIG.render.shadowMapSize,
    );
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 130;
    this.sun.shadow.camera.left = -34;
    this.sun.shadow.camera.right = 34;
    this.sun.shadow.camera.top = 34;
    this.sun.shadow.camera.bottom = -34;
    this.sun.shadow.bias = -0.0005;

    this.group.add(this.sky, this.clouds, hemisphereLight, this.sun, this.sun.target);
    scene.add(this.group);
    scene.add(this.segments.group);
  }

  private buildClouds(): void {
    const cloudMaterial = createToonMaterial(SKY_PALETTE.cloud);
    const puffGeometry = new THREE.IcosahedronGeometry(3.4, 0);
    const cloudCount = 9;
    for (let i = 0; i < cloudCount; i += 1) {
      const cloud = new THREE.Group();
      const puffs = 3 + Math.floor(Math.random() * 3);
      for (let p = 0; p < puffs; p += 1) {
        const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
        puff.position.set(
          (p - puffs / 2) * 3.2 + Math.random() * 1.2,
          Math.random() * 1.4,
          (Math.random() - 0.5) * 3,
        );
        puff.scale.set(1, 0.72, 1.05);
        cloud.add(puff);
      }
      cloud.position.set(
        (Math.random() - 0.5) * 320,
        24 + Math.random() * 26,
        -120 - Math.random() * 160,
      );
      this.clouds.add(cloud);
    }
  }

  update(dt: number, distance: number): void {
    this.segments.update(distance);
    this.sky.position.copy(this.camera.position);

    for (const cloud of this.clouds.children) {
      cloud.position.x += dt * 0.6;
      if (cloud.position.x > 190) cloud.position.x = -190;
    }
  }

  reset(): void {
    this.segments.reset();
    this.clouds.position.set(0, 0, 0);
  }
}
