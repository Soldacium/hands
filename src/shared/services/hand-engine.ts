import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CylinderGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  Vector3,
} from "three";

import bonesExample from "./bones-example";
import handBones from "./hand-bones";

class HandEngine {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  handState = 1;
  private frameId = 0;
  private controls!: OrbitControls;
  private hand!: THREE.Object3D;

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 200;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    const light = new THREE.PointLight(0xffffff, 2, 0);
    light.position.set(400, 400, 50);
    this.scene.add(light);

    const color = 0x000000;
    const intensity = 1;
    const lighta = new THREE.AmbientLight(color, intensity);
    this.scene.add(lighta);

    this.setupCameraMovement();

    document.addEventListener("resize", () => {
      this.resize();
    });

    bonesExample.initBones(this.scene);
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupCameraMovement(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  addHand() {
    const loader = new FBXLoader();

    loader.load(
      "src/assets/3d/hand.fbx",
      (object: THREE.Object3D) => {
        /*
        const material = new THREE.MeshBasicMaterial({
          color: "black",
        });
        (object.children[0] as THREE.Mesh).material = material;
        */
        this.hand = object;
        this.hand.position.z = 0;
        this.hand.position.x = 200;
        this.hand.position.y = -400;
        // this.scene.add(object);
        handBones.initBones(this.scene, this.hand);
        console.log(this.hand);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  addCube() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  stopRender() {
    if (this.frameId !== 0) {
      cancelAnimationFrame(this.frameId);
    }
  }
}

export default new HandEngine();
