<template>
  <div id="app">
    <router-view />
    <b-alert show>Default Alert</b-alert>
  </div>
</template>

<script>
import { BAlert } from 'bootstrap-vue';

export default {
  name: 'App',
  components: {
    BAlert
  }
}
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
