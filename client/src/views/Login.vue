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

      <div>
        <a>Forgot Password</a>
        <a>Create an Account</a>
      </div>
    </form>

    <form @submit.prevent>
      <div>
        <label for="name">Name</label>
        <input 
          v-model.trim="signupForm.name" 
          type="text" 
          placeholder="First Last" 
          id="name" 
        />
      </div>

      <div>
        <label for="email2">Email</label>
        <input 
          v-model.trim="signupForm.email" 
          type="email" 
          placeholder="you@email.com" 
          id="email2" 
        />
      </div>

      <div>
        <label for="password2">Password</label>
        <input
          v-model.trim="signupForm.password"
          type="password"
          placeholder="min 6 characters"
          id="password2"
        />
      </div>

      <button @click="signup">Sign Up</button>

      <div>
        <a>Back to Log In</a>
      </div>
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
      },
      signupForm: {
        name: '',
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
    },
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
