// import Delaunator from "delaunator";
import * as THREE from "three";

// options
const bgSizeMax = 120;
const bgSizeMin = 100;
const bgLayersMax = 5;
const bgSectionsPerLayer = 20;
const triangleGroups: THREE.Group[] = [];
const s = 10;

const makeRingedBakcground = (scene: THREE.Scene) => {
  const ng = new THREE.RingGeometry(
    bgSizeMin,
    bgSizeMax,
    bgSectionsPerLayer,
    bgLayersMax
  );
  separateTrianglesFromRingGeometry(ng);
  const triangleGeos = separateTrianglesFromRingGeometry(ng);
  makeTriangles(scene, triangleGeos);
};

const separateTrianglesFromRingGeometry = (
  geo: THREE.RingGeometry
): THREE.BufferGeometry[] => {
  console.log(geo);
  const positionArray: Float32Array = geo.getAttribute("position")
    .array as Float32Array;
  const indexArray = geo.index?.array;
  const triangleGeos = [];

  if (indexArray) {
    // loop through all triangles, indexArray has 3 indexes
    for (let i = 0; i < indexArray.length / 3; i++) {
      const triangleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(9);
      // for each index of a triangle find proper vertex
      for (let j = i * 3; j < i * 3 + 3; j++) {
        const vertexNum = indexArray[j];
        // get three coords of vertex from position array
        positions[(j - i * 3) * 3] = positionArray[vertexNum * 3];
        positions[(j - i * 3) * 3 + 1] = positionArray[vertexNum * 3 + 1];
        positions[(j - i * 3) * 3 + 2] = positionArray[vertexNum * 3 + 2];
      }

      triangleGeo.setIndex([0, 1, 2]);
      triangleGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      triangleGeo.computeVertexNormals();
      triangleGeos.push(triangleGeo);
    }
  }

  return triangleGeos;
};

const makeTriangles = (
  scene: THREE.Scene,
  triangleGeos: THREE.BufferGeometry[]
) => {
  const matWireframe = new THREE.LineBasicMaterial({
    color: `white`,
    linewidth: 1,
  });

  const madeTriangles: THREE.Mesh[] = [];

  triangleGeos.forEach((geo, i) => {
    const color = "black";
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color),
    });

    geo.computeVertexNormals();
    const triangle = new THREE.Mesh(geo, material);
    const geoEdges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(geoEdges, matWireframe);
    triangle.add(wireframe);
    madeTriangles.push(triangle);
  });

  setupTrianglesPositions(scene, madeTriangles);
};

const setupTrianglesPositions = (
  scene: THREE.Scene,
  triangles: THREE.Mesh[]
) => {
  for (let i = 0; i < bgLayersMax; i++) {
    const group1: THREE.Group = new THREE.Group();
    const group2: THREE.Group = new THREE.Group();

    for (let j = 0; j < bgSectionsPerLayer * 2; j++) {
      j % 2 === 0
        ? group1.add(triangles[i * bgSectionsPerLayer * 2 + j])
        : group2.add(triangles[i * bgSectionsPerLayer * 2 + j]);
    }

    triangleGroups.push(group1, group2);
    scene.add(group1);
    scene.add(group2);

    group1.position.z = -170 + 10 * i;
    group2.position.z = -170 + 10 * i + 6;
    group2.scale.set(2, 2, 2);

    // const maxDist = bgLayersMax * 10;
    // console.log(group1);
    /*
    group1.forEach((triangle, t) => {
      
      triangle.position.z = -50 - maxDist + i * 10;
      triangle.rotation.x = Math.sin(t / 12);
      triangle.rotation.y = Math.sin(t / 12);
    });

    group2.forEach((triangle, t) => {
      triangle.position.z = -50 - maxDist + i * 10 - 5;
      triangle.rotation.x = -Math.sin(t / bgSectionsPerLayer);
      triangle.rotation.y = -Math.sin(t / 12);
    });
    */
  }
};

const animateTriangles = (time: number) => {
  triangleGroups.forEach((group, i) => {
    const speed = s + (i * s) / 2;
    group.rotation.z += Math.cos((i / bgLayersMax) * 2 + time / speed) * 0.004;
  });
};

export default { makeRingedBakcground, animateTriangles };
