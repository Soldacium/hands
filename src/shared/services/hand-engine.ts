import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import BackgroundAnimation from "./background-animation";

class HandEngine {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  handState = 1;
  private frameId = 0;
  private controls!: OrbitControls;
  private hands!: THREE.Object3D;
  private handSkeleton!: THREE.Skeleton;
  private gui!: GUI;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private frameTime = 0;

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    const light = new THREE.PointLight(0xffff00, 0.4, 0);
    light.position.set(100, 100, 50);
    this.scene.add(light);

    const color = 0xeeeeee;
    const intensity = 1;
    const lighta = new THREE.AmbientLight(color, intensity);
    this.scene.add(lighta);

    this.setupCameraMovement();

    document.addEventListener("resize", () => {
      this.resize();
    });
    // BackgroundAnimation.makeFracturedBackground(this.scene);
    BackgroundAnimation.makeRingedBakcground(this.scene);
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
    const loader = new GLTFLoader();

    loader.load(
      "src/assets/3d/Hands2Anim.glb",
      (gltf: GLTF) => {
        this.hands = gltf.scene;
        this.scene.add(this.hands);
        console.log(this.hands);
        this.mixer = new THREE.AnimationMixer(gltf.scene);
        this.changeHandsMaterial();
        gltf.animations.forEach((clip) => {
          if (clip.name.includes("Idle")) {
            this.mixer.clipAction(clip).play();
          }
        });
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  changeHandsMaterial() {
    this.hands.children.forEach((hand) => {
      const handMesh: THREE.SkinnedMesh = hand.children[1] as THREE.SkinnedMesh;
      const newMaterial = new THREE.MeshLambertMaterial({
        color: 0xdaa520,
        side: THREE.FrontSide,
      });

      handMesh.material = newMaterial;
    });
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.frameTime += 1;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);

    var delta = this.clock.getDelta();

    BackgroundAnimation.animateTriangles(this.frameTime);

    if (this.mixer) this.mixer.update(delta);
  }

  stopRender() {
    if (this.frameId !== 0) {
      cancelAnimationFrame(this.frameId);
    }
  }
}

export default new HandEngine();
