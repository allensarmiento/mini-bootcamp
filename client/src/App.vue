<template>
  <div id="app">
    <navbar v-if="userProfile.name" />
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from './core/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  computed: mapState(['userProfile']),
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

html {
  font-size: 62.5%;

  --dark-primary-color: #455A64;
  --light-primary-color: #CFD8DC;
  --primary-color: #607D8B;
  --text: #FFF;
  --icons: #FFF;
  --accent-color: #448AFF;
  --primary-text: #212121;
  --secondary-text: #757575;
  --divider-color: #BDBDBD;
}

body {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
