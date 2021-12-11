import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default class HandEngine {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  handState = 1;
  private frameId = 0;

  setup(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 2 / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 200;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    const light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(400, 400, 50);
    this.scene.add(light);

    const color = 0xffffff;
    const intensity = 1;
    const lighta = new THREE.AmbientLight(color, intensity);
    this.scene.add(lighta);
  }

  addHand() {
    const loader = new FBXLoader();

    loader.load(
      "../../assets/3d/hand.fbx",
      (obj: THREE.Object3D) => {
        this.scene.add(obj);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
  }
}
