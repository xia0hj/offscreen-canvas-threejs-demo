<template>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import OffscreenWorker from './offscreen.worker.js';

export default {
  name: 'ModelCanvas',
  mounted() {
    this.loadByWorker();
    //this.loadByMainThread();
  },
  methods: {
    loadByMainThread() {
      const canvasRef = this.$refs.canvasRef;
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;

      const scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0xffffff));
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: canvasRef
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const controls = new OrbitControls(camera, renderer.domElement);
      camera.position.set(20, 20, 0);
      controls.update();

      new MTLLoader().load('/model/cup/cup.mtl', (materials) => {
        materials.preload();
        new OBJLoader().setMaterials(materials).load('/model/cup/cup.obj', (obj) => {
          scene.add(obj);
        });
      });

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    },
    loadByWorker() {
      const canvasRef = this.$refs.canvasRef;
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;
      const offscreen = canvasRef.transferControlToOffscreen();
      const offscreenWorker = new OffscreenWorker();
      offscreenWorker.postMessage({
        type: 'init',
        canvas: offscreen,
        initWidth: window.innerWidth,
        initHeight: window.innerHeight
      }, [offscreen]);
      window.addEventListener('resize', ()=>{
        offscreenWorker.postMessage({
          type: 'resize',
          width: window.innerWidth,
          height: window.innerHeight
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>