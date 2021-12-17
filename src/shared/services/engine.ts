import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Background from "./background";
import Hands from "./hands";
import Snake from "./snake";

class Engine {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private frameId = 0;
  private controls!: OrbitControls;
  private clock = new THREE.Clock();
  private frameTime = 0;

  init(canvas: HTMLCanvasElement) {
    this.setupScene();
    this.setupCanvas(canvas);
    this.setupRenderer();
    this.setupLights();
    this.setupCamera();
    this.setupEventListeners();
    this.render();
  }

  private setupCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private setupScene() {
    this.scene = new THREE.Scene();
    Background.makeRingedBakcground(this.scene);
    Hands.setupHands(this.scene);
    Snake.setupGame(this.scene);
    console.log(this.scene);
  }

  private setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
  }

  private setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private setupLights() {
    const light = new THREE.PointLight(0xffffff, 0.7, 0);
    light.position.set(0, 60, 100);
    this.scene.add(light);

    const color = 0x666666;
    const intensity = 1;
    const lighta = new THREE.AmbientLight(color, intensity);
    this.scene.add(lighta);
  }

  private setupEventListeners() {
    window.addEventListener("resize", () => {
      // this.resize();
    });
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.frameTime += 1;

    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);

    Background.animateTriangles(this.frameTime);
    Hands.updateHandsAnimation(this.clock);
    Snake.moveSnake(this.frameTime);
  }

  stopRender() {
    if (this.frameId !== 0) {
      cancelAnimationFrame(this.frameId);
    }
  }
}

export default new Engine();
