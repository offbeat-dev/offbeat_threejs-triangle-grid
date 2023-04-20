import * as THREE from 'three';
import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';

export default class Grid extends THREE.Mesh {
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;

  constructor(
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number
  ) {
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );
    const material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      wireframe: true,
    });
    super(geometry, material);
    this.geometry = geometry;
    this.material = material;
  }
}
