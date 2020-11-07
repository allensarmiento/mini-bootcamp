<template>
  <div>
    <button @click="logout">logout</button>
    <br/>
    <br/>
    <br/>
    <div>
      <router-link to="/lesson">Lesson 1</router-link>
    </div>
    <br/>
    <br/>
    <br/>
    <form v-if="userProfile.role === 'admin'" @submit.prevent>
      <div>
        <label for="name">Name</label>
        <input 
          v-model.trim="signupForm.name" 
          type="text" 
          placeholder="First" 
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
import { mapState } from 'vuex'

export default {
  data: function() {
    return {
      signupForm: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  computed: mapState(['userProfile']),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name
      })
      this.signupForm.name = ''
      this.signupForm.email = ''
      this.signupForm.password = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
