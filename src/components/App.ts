import * as THREE from 'three';

export default class App {
  gutter: {
    size: number;
  };
  meshes: any[];
  grid: {
    rows: number;
    cols: number;
  };
  width: number;
  height: number;
  mouse3D: THREE.Vector2;
  geometry: THREE.BoxGeometry;
  raycaster: THREE.Raycaster;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  floor: THREE.Mesh = new THREE.Mesh();
  groupMesh: THREE.Object3D = new THREE.Object3D();

  constructor() {
    this.gutter = { size: 4 };
    this.meshes = [];
    this.grid = { rows: 11, cols: 7 };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse3D = new THREE.Vector2();
    this.geometry = new THREE.BoxGeometry(10, 10, 10);
    this.raycaster = new THREE.Raycaster();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      1
    );
  }

  createScene() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    this.camera.position.set(0, 65, 0);
    this.camera.rotation.x = -1.57;

    this.scene.add(this.camera);
  }

  addAmbientLight() {
    const light = new THREE.AmbientLight('#ffffff', 1);

    this.scene.add(light);
  }

  addSpotLight() {
    const ligh = new THREE.SpotLight('#7bccd7', 1, 1000);

    ligh.position.set(0, 27, 0);
    ligh.castShadow = true;

    this.scene.add(ligh);
  }

  addRectLight() {
    const light = new THREE.RectAreaLight('#341212', 1, 2000, 2000);

    light.position.set(5, 50, 50);
    light.lookAt(0, 0, 0);

    this.scene.add(light);
  }

  addPointLight(color: number, position: { x: number; y: number; z: number }) {
    const light = new THREE.PointLight(color, 1, 1000, 1);

    light.position.set(position.x, position.y, position.z);

    this.scene.add(light);
  }

  addFloor() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.ShadowMaterial({ opacity: 0.3 });

    this.floor = new THREE.Mesh(geometry, material);
    this.floor.position.y = 0;
    this.floor.receiveShadow = true;
  }

  getRandomGeometry() {
    return this.geometry;
  }

  createGrid() {
    const material = new THREE.MeshPhysicalMaterial({
      color: '#3e2917',
      metalness: 0.58,
      roughness: 0.05,
    });

    for (let row = 0; row < this.grid.rows; row++) {
      this.meshes[row] = [];

      for (let index = 0; index < 1; index++) {
        const totalCol = this.getTotalRows(row);

        for (let col = 0; col < totalCol; col++) {
          const geometry: THREE.BoxGeometry = this.getRandomGeometry();
          const mesh: any = this.getMesh(geometry, material);

          mesh.position.y = 0;
          mesh.position.x =
            col +
            col * this.gutter.size +
            (totalCol === this.grid.cols ? 0 : 2.5);
          mesh.position.z = row + row * (index + 0.25);

          mesh.initialRotation = {
            x: mesh.rotation.x,
            y: mesh.rotation.y,
            z: mesh.rotation.z,
          };

          this.groupMesh.add(mesh);

          this.meshes[row][col] = mesh;
        }
      }
    }

    const centerX = -(this.grid.cols / 2) * this.gutter.size - 1;
    const centerZ = -(this.grid.rows / 2) - 0.8;

    this.groupMesh.position.set(centerX, 0, centerZ);

    this.scene.add(this.groupMesh);
  }

  getTotalRows(col: number) {
    return col % 2 === 0 ? this.grid.cols : this.grid.cols - 1;
  }

  getMesh(geometry: THREE.BoxGeometry, material: THREE.Material) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  draw() {
    // this.raycaster.setFromCamera(this.mouse3D, this.camera);
    // const intersects = this.raycaster.intersectObjects([this.floor]);
  }

  init() {
    this.createScene();

    this.createCamera();

    this.createGrid();

    this.addFloor();

    this.addAmbientLight();

    this.addSpotLight();

    this.addRectLight();

    this.addPointLight(0xfff000, { x: 0, y: 10, z: -100 });

    this.addPointLight(0x79573e, { x: 100, y: 10, z: 0 });

    this.addPointLight(0xc27439, { x: 20, y: 5, z: 20 });

    this.animate();

    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    this.onMouseMove({ clientX: 0, clientY: 0 });
  }

  onMouseMove({ clientX, clientY }) {
    this.mouse3D.x = (clientX / this.width) * 2 - 1;
    this.mouse3D.y = -(clientY / this.height) * 2 + 1;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    this.draw();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}
