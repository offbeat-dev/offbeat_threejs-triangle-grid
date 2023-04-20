import * as THREE from 'three';

export default class Triangle extends THREE.Mesh {
  points: THREE.Vector3[];

  constructor(points: THREE.Vector3[], material: THREE.MeshBasicMaterial) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    geometry.computeVertexNormals();
    super(geometry, material);
    this.points = points;
  }

  getCoordinates() {
    return this.points;
  }
}
