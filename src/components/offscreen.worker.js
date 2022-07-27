import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

self.onmessage = function (e) {
  const canvas = e.data.canvas;
  const innerWidth = e.data.innerWidth;
  const innerHeight = e.data.innerHeight;

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff));
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
  });
  renderer.setSize(innerWidth, innerHeight, false);

  camera.position.set(0, 0, 10);

  let loadedObj;
  new MTLLoader().load('http://localhost:8080/model/cup/cup.mtl', (materials) => {
    materials.preload();
    console.log('load mtl finish. ', materials);
    new OBJLoader().setMaterials(materials).load('http://localhost:8080/model/cup/cup.obj', (obj) => {
      obj.position.set(0, 0, 0);
      scene.add(obj);
      loadedObj = obj;
      console.log('load obj finish. ', loadedObj);
    });
  });

  function animate() {
    requestAnimationFrame(animate);
    if (loadedObj) {
      loadedObj.rotation.x += 0.01;
      loadedObj.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  }
  animate();
};
