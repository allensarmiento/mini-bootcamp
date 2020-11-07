<template>
  <div>
    <form @submit.prevent>
      <div>
        <label for="email1">Email</label>
        <input 
          v-model.trim="loginForm.email" 
          type="text" 
          placeholder="you@email.com" 
          id="email1" 
        />
      </div>

      <div>
        <label for="password1">Password</label>
        <input 
          v-model.trim="loginForm.password" 
          type="password" 
          placeholder="******" 
          id="password1" 
        />
      </div>

      <button class="button" @click="login">Log In</button>
    </form>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
