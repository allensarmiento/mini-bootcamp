<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
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
  // margin-top: 60px;
}
</style>
