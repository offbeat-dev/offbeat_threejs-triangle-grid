import * as THREE from 'three';
import Triangle from './components/Triangle';
import Grid from './components/Grid';
import Stats from 'stats.js';
import { distance } from './utils';
import TweenMax from 'gsap';

interface ITriangleObject {
  triangle: Triangle;
  opacity: number;
}

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const stats = new Stats();
const gridSize = 400;
const squareSize = 20;
const PARAMS = {
  color1: '#FFFFFF',
};
const triangleObjects: ITriangleObject[] = [];
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector('canvas.webgl') as HTMLElement;
const scene = new THREE.Scene();
const grid = new Grid(
  gridSize,
  gridSize,
  gridSize / squareSize,
  gridSize / squareSize
);
let aspect = sizes.width / sizes.height;
const frustumSize = 600;
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  1,
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

const groupMesh = new THREE.Object3D();
for (
  let i = Math.ceil((-gridSize / squareSize) * 0.5);
  i <= Math.floor((gridSize / squareSize) * 0.5);
  i++
) {
  for (
    let j = Math.ceil((-gridSize / squareSize) * 0.5);
    j <= Math.floor((gridSize / squareSize) * 0.5);
    j++
  ) {
    const points = [
      new THREE.Vector3(-squareSize / 2, squareSize / 2, 0),
      new THREE.Vector3(-squareSize / 2, -squareSize / 2, 0),
      new THREE.Vector3(squareSize / 2, squareSize / 2, 0),
    ];
    const opacity = 0.1 * Math.floor(Math.random() * 10 + 1);
    const material = new THREE.MeshBasicMaterial({
      color: PARAMS.color1,
      opacity: 0.1 * Math.floor(Math.random() * 10 + 1),
      transparent: true,
    });
    const triangle = new Triangle(points, material);
    triangle.rotateZ((Math.round(Math.random() * 4) * Math.PI) / 2);
    triangle.position.x += i * squareSize;
    triangle.position.y += j * squareSize;
    (triangle.material as THREE.Material).opacity = 0;

    const triangleObject = {
      triangle: triangle,
      opacity: opacity,
    };
    triangleObjects.push(triangleObject);
    groupMesh.add(triangle);
  }
}
scene.add(groupMesh);
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

window.addEventListener(
  'mousemove',
  (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  },
  {
    passive: true,
  }
);

const draw = () => {
  requestAnimationFrame(draw);
  render();
  stats.update();
};

const render = () => {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects([grid]);
  if (intersects.length) {
    const { x, y } = intersects[0].point;
    if (x === 0 && y === 0) return;
    triangleObjects.forEach(async (el: ITriangleObject) => {
      const mouseDistance = distance(
        x,
        y,
        el.triangle.position.x + groupMesh.position.x,
        el.triangle.position.y + groupMesh.position.y + 10
      );
      if (
        Math.abs(x - el.triangle.position.x + groupMesh.position.x) < 20 &&
        Math.abs(y - el.triangle.position.y + groupMesh.position.y) < 100
      ) {
        (el.triangle.material as THREE.Material).opacity = el.opacity;
        TweenMax.to(el.triangle.material, 2.0, {
          opacity: el.opacity,
        });
      } else {
        TweenMax.to(el.triangle.material, 2.0, {
          opacity: 0,
        });
      }
    });
  } else {
    triangleObjects.forEach(async (el: ITriangleObject) => {
      TweenMax.to(el.triangle.material, 2.0, {
        opacity: 0,
      });
    });
  }

  renderer.render(scene, camera);
};

draw();

// import App from './components/App';

// new App().init();
