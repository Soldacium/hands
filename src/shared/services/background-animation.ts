import Delaunator from "delaunator";
import * as THREE from "three";
import { BufferGeometry } from "three";

import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

// options
const pointsNum = 40;
const bgSizeMax = 12;
const bgSizeMin = 4;
const bgLayersMax = 3;
const bgSectionsPerLayer = 12;

const makeFracturedBackground = (scene: THREE.Scene) => {
  const points = [];
  const width = window.innerWidth * 0.08;
  const height = window.innerHeight * 0.08;
  const coords: Array<[number[], number[], number[]]> = [];
  for (let i = 0; i < pointsNum; i++) {
    const x = Math.floor(Math.random() * width) - 0.5 * width;
    const y = Math.floor(Math.random() * height) - 0.5 * height;
    points.push([x, y]);
  }
  const delaunay = Delaunator.from(points);
  const triangles = delaunay.triangles;

  for (let i = 0; i < triangles.length; i += 3) {
    coords.push([
      points[triangles[i]],
      points[triangles[i + 1]],
      points[triangles[i + 2]],
    ]);
  }

  const triangles3d: THREE.Object3D[] = [];
  coords.forEach((coord, i) => {
    const material = new THREE.MeshLambertMaterial({
      color: "green",
      side: THREE.BackSide,
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setDrawRange(0, 3 * 3);
    const positions = new Float32Array(9);
    coord.forEach((point, i) => {
      positions[i * 3] = point[0];
      positions[i * 3 + 1] = point[1];
      positions[i * 3 + 2] = 0;
    });
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    const triangle = new THREE.Mesh(geometry, material);
    const color = `rgb(
      ${Math.round((256 / triangles.length) * 3 * i)},
      ${Math.round((256 / triangles.length) * 3 * i)},
      ${Math.floor(0)})`;
    triangle.material.color = new THREE.Color(color);
    triangle.position.z = -5;
    scene.add(triangle);
    triangles3d.push(triangle);
  });
};

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

      triangleGeo.setIndex(new THREE.BufferAttribute(positions, 3));
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
    color: `rgb(
      ${0},
      ${0},
      ${0})`,
    linewidth: 1,
  });

  const madeTriangles: THREE.Mesh[] = [];
  for (let i = 0; i < bgLayersMax; i++) {
    const group1: THREE.BufferGeometry[] = [];
    const group2: THREE.BufferGeometry[] = [];

    for (let j = 0; j < bgSectionsPerLayer * 2; j++) {
      console.log(triangleGeos[i * bgLayersMax + j], i * bgLayersMax + j);
      j % 2 === 0
        ? group1.push(triangleGeos[i * bgSectionsPerLayer + j])
        : group2.push(triangleGeos[i * bgSectionsPerLayer + j]);
    }

    const [mat1, mat2] = getTestingMaterials(i);
    console.log(group1, group2);
    // THREE.BufferGeometryUtils.mergeBufferGeometries([group1[0], group1[1]]);
    //console.log(BufferGeometryUtils.mergeBufferGeometries, group1);
    /*
    const [combinedGeo1, combinedGeo2] = [
      THREE.BufferGeometryUtils.mergeBufferGeometries(group1),
      THREE.BufferGeometryUtils.mergeBufferGeometries(group2),
    ];

    combinedGeo1.computeVertexNormals();
    combinedGeo2.computeVertexNormals();
    const [triangles1, triangles2] = [
      new THREE.Mesh(combinedGeo1, mat1),
      new THREE.Mesh(combinedGeo2, mat2),
    ];
    console.log([triangles1, triangles2]);
    */
  }
  triangleGeos.forEach((geo, i) => {
    const color = `rgb(
      ${Math.round((256 / triangleGeos.length) * i)},
      ${Math.round((256 / triangleGeos.length) * i)},
      ${Math.round((256 / triangleGeos.length) * i)})`;
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color),
    });
    geo.computeVertexNormals();

    const triangle = new THREE.Mesh(geo, material);
    // const geoEdges = new THREE.EdgesGeometry(geo);
    //const wireframe = new THREE.LineSegments(geoEdges, matWireframe);
    //triangle.add(wireframe);
    madeTriangles.push(triangle);
    scene.add(triangle);
  });
};

const getTestingMaterials = (
  lightness: number
): THREE.MeshLambertMaterial[] => {
  const mat1 = new THREE.MeshLambertMaterial({
    color: new THREE.Color(`rgb(
      ${lightness * 30},
      ${lightness * 30},
      ${lightness * 30})`),
  });

  const mat2 = new THREE.MeshLambertMaterial({
    color: new THREE.Color(`rgb(
      ${lightness * 30 + 20},
      ${lightness * 30 + 20},
      ${lightness * 30 + 20})`),
  });
  testMerge();
  return [mat1, mat2];
};

const testMerge = () => {
  const [cylGeometry, sphereGeometry] = [
    new THREE.CylinderGeometry(10, 10, 10),
    new THREE.SphereGeometry(20, 20, 20),
  ];
  console.log(
    BufferGeometryUtils.mergeBufferGeometries([cylGeometry, sphereGeometry])
  );

  //var mesh = new THREE.Mesh( bufGeometry, material );

  //scene.add(mesh);
};

// from three.js / modified
const getSeperateTrianglesRing = (
  innerRadius = 0.5,
  outerRadius = 1,
  thetaSegments = 8,
  phiSegments = 1,
  thetaStart = 0,
  thetaLength = Math.PI * 2
): THREE.BufferGeometry[] => {
  const triangles: THREE.BufferGeometry[] = [];
  thetaSegments = Math.max(3, thetaSegments);
  phiSegments = Math.max(1, phiSegments);

  // buffers

  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];

  // some helper variables

  let radius = innerRadius;
  const radiusStep = (outerRadius - innerRadius) / phiSegments;
  const vertex = new THREE.Vector3();
  const uv = new THREE.Vector2();

  // generate vertices, normals and uvs

  for (let j = 0; j <= phiSegments; j++) {
    for (let i = 0; i <= thetaSegments; i++) {
      // values are generate from the inside of the ring to the outside

      const segment = thetaStart + (i / thetaSegments) * thetaLength;

      // vertex

      vertex.x = radius * Math.cos(segment);
      vertex.y = radius * Math.sin(segment);

      vertices.push(vertex.x, vertex.y, vertex.z);

      // normal

      normals.push(0, 0, 1);

      // uv

      uv.x = (vertex.x / outerRadius + 1) / 2;
      uv.y = (vertex.y / outerRadius + 1) / 2;

      uvs.push(uv.x, uv.y);
    }

    // increase the radius for next row of vertices

    radius += radiusStep;
  }

  // indices

  for (let j = 0; j < phiSegments; j++) {
    const thetaSegmentLevel = j * (thetaSegments + 1);

    for (let i = 0; i < thetaSegments; i++) {
      const segment = i + thetaSegmentLevel;

      const a = segment;
      const b = segment + thetaSegments + 1;
      const c = segment + thetaSegments + 2;
      const d = segment + 1;

      // faces

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // build geometry

  /*
  this.setIndex( indices );
  this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
  this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
  this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
  */

  return triangles;
};

export default { makeFracturedBackground, makeRingedBakcground };
