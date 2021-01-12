<template>
  <section class="login">
    <div class="login__form">
      <h3 class="login__form__title">Login</h3>

      <BForm @submit.prevent="login">
        <BFormGroup
          id="input-group-email"
          label="Email address:"
          label-for="input-email"
        >
          <BFormInput
            v-model="loginForm.email"
            id="input-email"
            class="login__form__input"
            type="email"
            placeholder="Email"
            required
          />
        </BFormGroup>

        <BFormGroup
          id="input-group-password"
          label="Password:"
          label-for="input-password"
        >
          <BFormInput
            v-model="loginForm.password"
            id="input-password"
            class="login__form__input"
            type="password"
            placeholder="Password"
            required
          />
        </BFormGroup>

        <BButton
          class="login__form__submit"
          variant="primary"
          type="submit"
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

  &__form {
    padding: 3rem;
    background-color: var(--light-primary-color);
    font-size: 2rem;
    text-align: left;

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
}
</style>
