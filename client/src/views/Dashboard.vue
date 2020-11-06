<template>
  <div>
    <button @click="logout">logout</button>
  </div>  
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
