import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

self.onmessage = function (e) {
  const data = e.data;
  switch (data.type) {
    case 'init': {
      initRender(data);
      break;
    }
    case 'resize': {
      self.renderer.setSize(data.width, data.height, false);
      break;
    }
  }
};

function initRender(data) {
  self.scene = new THREE.Scene();
  self.scene.add(new THREE.AmbientLight(0xffffff));
  self.camera = new THREE.PerspectiveCamera(75, data.initWidth / data.initHeight, 0.1, 1000);
  self.renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: data.canvas
  });
  self.renderer.setSize(data.initWidth, data.initHeight, false);

  self.camera.position.set(0, 0, 10);

  let loadedObj;
  new MTLLoader().load('http://localhost:8080/model/cup/cup.mtl', (materials) => {
    materials.preload();
    console.log('load mtl finish. ', materials);
    new OBJLoader().setMaterials(materials).load('http://localhost:8080/model/cup/cup.obj', (obj) => {
      obj.position.set(0, 0, 0);
      self.scene.add(obj);
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
    self.renderer.render(self.scene, self.camera);
  }
  animate();
}
