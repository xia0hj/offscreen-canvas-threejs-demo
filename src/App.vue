<template>
  <div id="app">
    <ModelCanvas></ModelCanvas>
  </div>
</template>

<script>
import ModelCanvas from './components/ModelCanvas.vue';

export default {
  name: 'App',
  components: {
    ModelCanvas
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
