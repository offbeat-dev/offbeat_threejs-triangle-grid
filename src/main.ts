import * as THREE from 'three';
import Triangle from './components/Triangle';
import Stats from 'stats.js';
import { Pane } from 'tweakpane';

let color = 0xffff00;
const PARAMS = {
  factor: 123,
  color: color,
};

const pane = new Pane();

pane.addInput(PARAMS, 'factor');
pane.addInput(PARAMS, 'color').on('change', (ev) => {
  color = ev.value;
});

const canvas = document.querySelector('canvas.webgl') as HTMLElement;
const scene = new THREE.Scene();
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
const material = new THREE.MeshBasicMaterial({
  color: color,
});
const points = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, -100, 0),
  new THREE.Vector3(100, 0, 0),
];
const mesh = new Triangle(points, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let aspect = sizes.width / sizes.height;

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
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
