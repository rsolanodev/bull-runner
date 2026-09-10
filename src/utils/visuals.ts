import * as THREE from 'three';
import { SKY_PALETTE } from '../config';

let toonGradient: THREE.DataTexture | null = null;

export function getToonGradient(): THREE.DataTexture {
  if (toonGradient) return toonGradient;
  const levels = new Uint8Array([60, 140, 210, 255]);
  const texture = new THREE.DataTexture(levels, levels.length, 1, THREE.RedFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  toonGradient = texture;
  return texture;
}

export function createToonMaterial(
  color: THREE.ColorRepresentation,
  options: { gradientMap?: THREE.Texture; emissive?: THREE.ColorRepresentation } = {},
): THREE.MeshToonMaterial {
  const material = new THREE.MeshToonMaterial({
    color,
    gradientMap: options.gradientMap ?? getToonGradient(),
  });
  if (options.emissive !== undefined) {
    material.emissive = new THREE.Color(options.emissive);
  }
  return material;
}

export function flatGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
  const flat = geometry.toNonIndexed();
  flat.computeVertexNormals();
  return flat as T;
}

export function addInkOutline(
  mesh: THREE.Mesh,
  thickness = 0.04,
  color: THREE.ColorRepresentation = SKY_PALETTE.inkNavy,
): THREE.Mesh {
  const outline = new THREE.Mesh(
    mesh.geometry,
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    }),
  );
  outline.scale.setScalar(1 + thickness);
  outline.renderOrder = -1;
  outline.castShadow = false;
  outline.receiveShadow = false;
  mesh.add(outline);
  return outline;
}

export function createFlatShadow(
  radius: number,
  opacity = 0.22,
  color: THREE.ColorRepresentation = SKY_PALETTE.shadowBlue,
): THREE.Mesh {
  const geometry = new THREE.CircleGeometry(radius, 10);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = 1;
  return mesh;
}

export function disposeObject(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      const material = child.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material.dispose();
    }
  });
}
