import Delaunator from "delaunator";
import * as THREE from "three";
import { BufferGeometry } from "three";

const makeFracturedBackground = (scene: THREE.Scene) => {
  const points = [];
  const pointsNum = 40;
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
      //polygonOffsetFactor: 1,
      //polygonOffsetUnits: 1,
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
    // geometry.computeBoundingSphere();
    // console.log(geometry);
    const triangle = new THREE.Mesh(geometry, material);
    const color = `rgb(
      ${Math.round((256 / triangles.length) * 3 * i)},
      ${Math.round((256 / triangles.length) * 3 * i)},
      ${Math.floor(0)})`;
    triangle.material.color = new THREE.Color(color);
    triangle.position.z = -5;
    scene.add(triangle);
    console.log(triangle);
    triangles3d.push(triangle);

    /*
    const geo = new THREE.EdgesGeometry(triangle.geometry);
    const mat = new THREE.LineBasicMaterial({
      color: `rgb(
        ${Math.floor(10 * i)},
        ${Math.floor(10 * i)},
        ${0})`,
      linewidth: 1,
    });
    const wireframe = new THREE.LineSegments(geo, mat);
    triangle.add(wireframe);
    */
    /*
   
    const geo = new THREE.EdgesGeometry(triangle.geometry);
    const mat = new THREE.LineBasicMaterial({
      color: "rgb(212,212,212)",
      linewidth: 1,
    });
    const wireframe = new THREE.LineSegments(geo, mat);
    triangle.add(wireframe);
    */
    /*
      const face = new THREE.face;
      geometry.faces.push(face);

      const triangle = new THREE.Mesh(geometry, material);
      triangle.position.z = 600;
      scene.add(triangle);

      const geo = new THREE.EdgesGeometry( triangle.geometry );
      const mat = new THREE.LineBasicMaterial( { color: 'rgb(212,212,212)', linewidth: 1 } );
      const wireframe = new THREE.LineSegments( geo, mat );
      triangle.add(wireframe);

      triangles.push(triangle);
      */
  });
};
const makeRingedBakcground = (scene: THREE.Scene) => {
  const ng = new THREE.RingGeometry(1, 5, 12, 3);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  const ngPos = ng.getAttribute("position").array as Float32Array;
  separateTrianglesFromRingGeometry(ng);

  const mesh = new THREE.Mesh(ng, material);
  // scene.add(mesh);
  console.log(ng);

  const triangleGeos = separateTrianglesFromRingGeometry(ng);
  makeTriangles(scene, triangleGeos);
};

const separateTrianglesFromRingGeometry = (
  geo: THREE.RingGeometry
): BufferGeometry[] => {
  const positionArray: Float32Array = geo.getAttribute("position")
    .array as Float32Array;
  const indexArray = geo.index?.array;
  const triangleGeos = [];
  if (indexArray) {
    // loop through all triangles, indexArray has 3 indexes
    for (let i = 0; i < indexArray.length / 3; i++) {
      const triangleGeo = new BufferGeometry();
      const positions = new Float32Array(9);
      // for each index of a triangle find proper vertex
      for (let j = i * 3; j < i * 3 + 2; j++) {
        const vertexNum = indexArray[j];
        // get three coords of vertex from position array
        positions[(j - i * 3) * 3] = positionArray[vertexNum];
        positions[(j - i * 3) * 3] = positionArray[vertexNum + 1];
        positions[(j - i * 3) * 3] = positionArray[vertexNum + 2];
        /*
        for(let k = vertexNum; k < vertexNum + 2; k++){
          positions[0] = positionArray[k];
        }
        */
      }

      triangleGeos.push(
        triangleGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        )
      );
    }
  }

  return triangleGeos;
};

const makeTriangles = (
  scene: THREE.Scene,
  triangleGeos: THREE.BufferGeometry[]
) => {
  const material = new THREE.MeshPhongMaterial({
    color: "green",
  });

  const matWireframe = new THREE.LineBasicMaterial({
    color: `rgb(
      ${0},
      ${0},
      ${0})`,
    linewidth: 1,
  });

  const madeTriangles: THREE.Mesh[] = [];
  const triangleData = [];
  triangleGeos.forEach((geo, i) => {
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    const triangle = new THREE.Mesh(geo, material);
    triangle.position;
    const geoEdges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(geoEdges, matWireframe);
    triangle.add(wireframe);
    madeTriangles.push(triangle);
    scene.add(triangle);
  });

  console.log(madeTriangles[20]);
};

export default { makeFracturedBackground, makeRingedBakcground };
