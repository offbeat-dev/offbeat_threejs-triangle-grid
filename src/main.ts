import * as THREE from 'three';
import Triangle from './components/Triangle';
import Grid from './components/Grid';
import Stats from 'stats.js';
const stats = new Stats();
const gridSize = 100;
const squareSize = 20;
const PARAMS = {
  color1: '#FFFFFF',
};
const triangles = [];
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector('canvas.webgl') as HTMLElement;
const scene = new THREE.Scene();
const grid = new Grid(gridSize, gridSize, 5, 5);
let aspect = sizes.width / sizes.height;
const frustumSize = 600;
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  150,
  10000
);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(stats.dom);
scene.add(grid);

for (let i = -2; i < 3; i++) {
  for (let j = -2; j < 3; j++) {
    const points = [
      new THREE.Vector3(-squareSize / 2, squareSize / 2, 0),
      new THREE.Vector3(-squareSize / 2, -squareSize / 2, 0),
      new THREE.Vector3(squareSize / 2, squareSize / 2, 0),
    ];
    const material = new THREE.MeshBasicMaterial({
      color: PARAMS.color1,
      opacity: 0.25 * Math.floor(Math.random() * 4 + 1),
      transparent: true,
    });
    const triangle = new Triangle(points, material);
    triangle.rotateZ((Math.round(Math.random() * 4) * Math.PI) / 2);
    triangle.position.x += i * squareSize;
    triangle.position.y += j * squareSize;
    triangles.push(triangle);
    scene.add(triangle);
  }
}

triangles.forEach((el: Triangle) => {
  (el.material as THREE.Material).opacity = 0.75;
});

scene.add(camera);
stats.showPanel(0);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  aspect = sizes.width / sizes.height;

  renderer.setSize(sizes.width, sizes.height);

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
// const clock = new THREE.Clock();
const tick = () => {
  stats.begin();
  // const elapsedTime = clock.getElapsedTime();
  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.z += 0.01 * Math.sin(1);
  renderer.render(scene, camera);
  stats.end();

  window.requestAnimationFrame(tick);
};

tick();
