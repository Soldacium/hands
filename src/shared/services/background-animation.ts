import Delaunator from "delaunator";
import * as THREE from "three";
import { BufferGeometry } from "three";

import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

// options
const pointsNum = 40;
const bgSizeMax = 40;
const bgSizeMin = 10;
const bgLayersMax = 3;
const bgSectionsPerLayer = 12;
const triangleGroups: THREE.Mesh[][] = [];

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
  const wireframeColor = new THREE.Color("gold");
  const matWireframe = new THREE.LineBasicMaterial({
    color: `gold`,
    linewidth: 1,
  });

  const madeTriangles: THREE.Mesh[] = [];

  triangleGeos.forEach((geo, i) => {
    /*
    const color = `rgb(
      ${Math.round((256 / triangleGeos.length) * i)},
      ${Math.round((256 / triangleGeos.length) * i)},
      ${Math.round((256 / triangleGeos.length) * i)})`;
      */
    const color = "black";
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color),
    });
    geo.computeVertexNormals();

    const triangle = new THREE.Mesh(geo, material);
    // triangle.position.z = (-triangleGeos.length + i) / 4;
    const geoEdges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(geoEdges, matWireframe);
    triangle.add(wireframe);
    madeTriangles.push(triangle);
    scene.add(triangle);
  });

  setupTrianglesPositions(madeTriangles);
};

const setupTrianglesPositions = (triangles: THREE.Mesh[]) => {
  for (let i = 0; i < bgLayersMax; i++) {
    const group1: THREE.Mesh[] = [];
    const group2: THREE.Mesh[] = [];

    for (let j = 0; j < bgSectionsPerLayer * 2; j++) {
      // console.log(triangleGeos[i * bgLayersMax + j], i * bgLayersMax + j);

      j % 2 === 0
        ? group1.push(triangles[i * bgSectionsPerLayer * 2 + j])
        : group2.push(triangles[i * bgSectionsPerLayer * 2 + j]);
    }

    triangleGroups.push(group1, group2);

    const maxDist = bgLayersMax * 10;
    group1.forEach((triangle, t) => {
      triangle.position.z = -maxDist + i * 10;
      triangle.rotation.x = Math.sin(t / 12);
      triangle.rotation.y = Math.sin(t / 12);
    });

    group2.forEach((triangle, t) => {
      triangle.position.z = -maxDist + i * 10 - 5;
      triangle.rotation.x = -Math.sin(t / 12);
      triangle.rotation.y = -Math.sin(t / 12);
    });
  }
};

const animateTriangles = (time: number) => {
  triangleGroups.forEach((group) => {
    group.forEach((triangle) => {
      // console.log(time);
      triangle.position.x += Math.cos(time / 30) * 1;
      triangle.position.y += Math.cos(time / 30 + Math.PI / 2) * 1;
    });
  });
};

export default { makeRingedBakcground, animateTriangles };
