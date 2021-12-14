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
        /*
        this.scene.add(this.hand);
        this.handSkeleton = (
          this.hand.children[0].children[0].children[0].children[0]
            .children[2] as THREE.SkinnedMesh
        ).skeleton;
        */
        // this.setupHandSkeletonGUI();
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

  private setupHandSkeletonGUI() {
    this.gui = new GUI();
    for (let i = 0; i < this.handSkeleton.bones.length; i++) {
      const bone = this.handSkeleton.bones[i];

      const folder = this.gui.addFolder("Bone " + i);

      folder.add(
        bone.position,
        "x",
        -10 + bone.position.x,
        10 + bone.position.x
      );
      folder.add(
        bone.position,
        "y",
        -10 + bone.position.y,
        10 + bone.position.y
      );
      folder.add(
        bone.position,
        "z",
        -10 + bone.position.z,
        10 + bone.position.z
      );

      folder.add(bone.rotation, "x", -Math.PI, Math.PI);
      folder.add(bone.rotation, "y", -Math.PI, Math.PI);
      folder.add(bone.rotation, "z", -Math.PI, Math.PI);

      folder.add(bone.scale, "x", 0, 2);
      folder.add(bone.scale, "y", 0, 2);
      folder.add(bone.scale, "z", 0, 2);

      folder.__controllers[0].name("position.x");
      folder.__controllers[1].name("position.y");
      folder.__controllers[2].name("position.z");

      folder.__controllers[3].name("rotation.x");
      folder.__controllers[4].name("rotation.y");
      folder.__controllers[5].name("rotation.z");

      folder.__controllers[6].name("scale.x");
      folder.__controllers[7].name("scale.y");
      folder.__controllers[8].name("scale.z");
    }
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);

    var delta = this.clock.getDelta();

    if (this.mixer) this.mixer.update(delta);
  }

  stopRender() {
    if (this.frameId !== 0) {
      cancelAnimationFrame(this.frameId);
    }
  }
}

export default new HandEngine();
