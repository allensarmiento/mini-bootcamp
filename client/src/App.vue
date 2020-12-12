<template>
  <div id="app">
    <Navbar v-if="userProfile.name" />
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from './Navbar/views/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  computed: mapState(['userProfile']),
};
</script>

<style lang="scss">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }

:root {
  --dark-primary-color: #455A64;
  --primary-color: #607D8B;
  --light-primary-color: #CFD8DC;
  --accent-color: #448AFF;

  --text-light: #FFF;
  --text-light-grey: #BDBDBD;
  --text-dark: #212121;
  --text-secondary: #757575;

  --icons: #FFF;
  --divider-color: #BDBDBD;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

html {
  --dark-primary-color: #455A64;

  font-size: 62.5%;
}

body {
  box-sizing: border-box;
}
</style>
