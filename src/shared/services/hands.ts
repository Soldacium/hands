import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let handState = 1;
let hands!: THREE.Object3D;
let mixer!: THREE.AnimationMixer;

const setupHands = (scene: THREE.Scene) => {
  const loader = new GLTFLoader();

  loader.load(
    "src/assets/3d/Hands2Anim.glb",
    (gltf: GLTF) => {
      hands = gltf.scene;
      scene.add(hands);
      console.log(hands);
      mixer = new THREE.AnimationMixer(gltf.scene);
      changeHandsMaterial();
      gltf.animations.forEach((clip) => {
        if (clip.name.includes("Idle")) {
          mixer.clipAction(clip).play();
        }
      });
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
};

const changeHandsMaterial = () => {
  hands.children.forEach((hand) => {
    const handMesh: THREE.SkinnedMesh = hand.children[1] as THREE.SkinnedMesh;
    const newMaterial = new THREE.MeshLambertMaterial({
      // color: 0xdaa520,
      color: "white",
      side: THREE.FrontSide,
    });

    handMesh.material = newMaterial;
  });
};

const updateHandsAnimation = (clock: THREE.Clock) => {
  let delta = clock.getDelta();
  if (mixer) mixer.update(delta);
};

export default { setupHands, updateHandsAnimation };
