<template>
  <section class="login">
    <div class="login-form">
      <h3 class="login-form__title">Login</h3>
      <b-form @submit.prevent="login">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            class="login-form__input"
            v-model="loginForm.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-form-group 
          id="input-group-2" 
          label="Password:" 
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            class="login-form__input"
            v-model="loginForm.password"
            type="password"
            required
            placeholder="******"
          ></b-form-input>
        </b-form-group>

        <b-button 
          class="login-form__submit" 
          type="submit" 
          variant="primary"
        >
          Login
        </b-button>
      </b-form>
    </div>  
  </section>
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
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;
    height: 100vh;
    padding: 4rem;
  }

  .login-form {
    padding: 3rem;
    background: var(--light-primary-color);
    text-align: left;
    font-size: 2rem;

    &__title {
      font-size: 3rem;
    }

    &__input {
      font-size: 1.4rem;
    }

    &__submit {
      font-size: 1.6rem;
    }
  }
</style>
