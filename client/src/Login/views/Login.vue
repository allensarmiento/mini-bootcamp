<template>
  <section class="login">
    <div class="login-form">
      <h3 class="login-form__title">Login</h3>

      <BForm @submit.prevent="login">
        <!-- Email -->
        <BFormGroup
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
        >
          <BFormInput
            v-model="loginForm.email"
            id="input-1"
            class="login-form__input"
            type="email"
            placeholder="Enter email"
            required
          />
        </BFormGroup>

        <!-- Password -->
        <BFormGroup
          id="input-group-2"
          label="Password:"
          label-for="input-2"
        >
          <BFormInput
            v-model="loginForm.password"
            id="input-2"
            class="login-form__input"
            type="password"
            placeholder="******"
            required
          ></BFormInput>
        </BFormGroup>

        <!-- Login -->
        <BButton
          class="login-form__submit"
          type="submit"
          variant="primary"
        >
          Login
        </BButton>
      </BForm>
    </div>
  </section>
</template>

<script>
import {
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
} from 'bootstrap-vue';

export default {
  name: 'Login',
  components: {
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const { email, password } = this.loginForm;
      this.$store.dispatch('login', { email, password });
    },
  },
};
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
