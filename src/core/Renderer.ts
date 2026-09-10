import * as THREE from 'three';
import { CONFIG, SKY_PALETTE } from '../config';

export class Renderer {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly webgl: THREE.WebGLRenderer;
  private readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SKY_PALETTE.skyMain);

    this.camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      1,
      CONFIG.camera.near,
      CONFIG.camera.far,
    );
    this.camera.position.set(
      0,
      CONFIG.camera.height,
      CONFIG.camera.distance,
    );

    this.webgl = new THREE.WebGLRenderer({
      antialias: CONFIG.render.antialias,
      powerPreference: 'high-performance',
    });
    this.webgl.outputColorSpace = THREE.SRGBColorSpace;
    this.webgl.shadowMap.enabled = CONFIG.render.shadows;
    this.webgl.shadowMap.type = THREE.PCFSoftShadowMap;
    this.webgl.setClearColor(SKY_PALETTE.skyMain);

    this.container.appendChild(this.webgl.domElement);

    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('orientationchange', this.resize);
  }

  readonly resize = (): void => {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      CONFIG.render.maxPixelRatio,
    );
    this.webgl.setPixelRatio(pixelRatio);
    this.webgl.setSize(width, height, false);
  };

  render(): void {
    this.webgl.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('orientationchange', this.resize);
    this.webgl.dispose();
    this.webgl.domElement.remove();
  }
}
