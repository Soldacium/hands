import * as THREE from "three";

export interface Sizing {
  segmentHeight: number;
  segmentCount: number;
  height: number;
  halfHeight: number;
}

const modifyGeometry = (geometry: THREE.BufferGeometry, sizing: Sizing) => {
  const position = geometry.attributes.position;

  const vertex = new THREE.Vector3();

  const skinIndices = [];
  const skinWeights = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);

    const y = vertex.y + sizing.halfHeight;

    const skinIndex = Math.floor(y / sizing.segmentHeight);
    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

    skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute(
    "skinIndex",
    new THREE.Uint16BufferAttribute(skinIndices, 4)
  );
  geometry.setAttribute(
    "skinWeight",
    new THREE.Float32BufferAttribute(skinWeights, 4)
  );

  return geometry;
};

const createBones = (sizing: Sizing) => {
  const bones = [];

  let prevBone = new THREE.Bone();
  bones.push(prevBone);
  prevBone.position.y = -sizing.halfHeight;

  for (let i = 0; i < sizing.segmentCount; i++) {
    const bone = new THREE.Bone();
    bone.position.y = sizing.segmentHeight;
    bones.push(bone);
    prevBone.add(bone);
    prevBone = bone;
  }

  return bones;
};

const createMesh = (
  scene: THREE.Scene,
  geometry: THREE.BufferGeometry,
  bones: THREE.Bone[]
) => {
  const material = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const mesh = new THREE.SkinnedMesh(geometry, material);
  const skeleton = new THREE.Skeleton(bones);

  mesh.add(bones[0]);

  mesh.bind(skeleton);

  const skeletonHelper = new THREE.SkeletonHelper(mesh);
  scene.add(skeletonHelper);

  return mesh;
};

const initBones = (scene: THREE.Scene, hand: THREE.Object3D) => {
  const segmentHeight = 2;
  const segmentCount = 64;
  const height = segmentHeight * segmentCount;
  const halfHeight = height * 0.5;

  const sizing = {
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight,
  };

  const modifiedGeo = modifyGeometry(
    (hand.children[0] as THREE.Mesh).geometry,
    sizing
  );
  const bones = createBones(sizing);
  const mesh = createMesh(scene, modifiedGeo, bones);

  mesh.scale.multiplyScalar(1);
  scene.add(mesh);
};

export default { initBones, createMesh, modifyGeometry, createBones };
