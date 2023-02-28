<template>
  <div id="app">
    <SimuladorDeAposentadoria />
  </div>
</template>

<script>
import SimuladorDeAposentadoria from "./components/SimuladorDeAposentadoria.vue";

export default {
  name: "App",
  components: {
    SimuladorDeAposentadoria,
  },
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
