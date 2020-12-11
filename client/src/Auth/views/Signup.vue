<template>
  <div class="signup-form">
    <h3 class="signup-form__title">Sign Up</h3>

    <BForm @submit.prevent="signup">
      <!-- Name -->
      <BFormGroup id="input-group-1" label="Name:" label-for="input-1">
        <BFormInput
          v-model="signupForm.name"
          id="input-1"
          class="signup-form__input"
          placeholder="Enter name"
          required
        />
      </BFormGroup>

      <!-- Email -->
      <BFormGroup
        id="input-group-2"
        label="Email address:"
        label-for="input-2"
        description="We'll never share your email with anyone else."
      >
        <BFormInput
          v-model="signupForm.email"
          id="input-2"
          class="signup-form__input"
          type="email"
          placeholder="Enter email"
          required
        />
      </BFormGroup>

      <!-- Password -->
      <BFormGroup id="input-group-3" label="Password:" label-for="input-3">
        <BFormInput
          v-model="signupForm.password"
          id="input-3"
          class="signup-form__input"
          type="password"
          placeholder="Enter password"
          required
        />
      </BFormGroup>

      <!-- Verify Password -->
      <BFormGroup
        id="input-group-4"
        label="Verify Password"
        label-for="input-3"
      >
        <BFormInput
          v-model="signupForm.verifyPassword"
          id="input-4"
          class="signup-form__input"
          type="password"
          placeholder="Enter password again"
          required
        />
      </BFormGroup>

      <!-- Submit -->
      <BButton
        class="signup-form__submit"
        type="submit"
        variant="primary"
      >Sign Up</BButton>
    </BForm>
  </div>
</template>

<script>
import {
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
} from 'bootstrap-vue';

export default {
  name: 'SignupForm',
  components: {
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
  },
  data() {
    return {
      signupForm: {
        name: '',
        email: '',
        password: '',
        verifyPassword: '',
      },
    };
  },
  methods: {
    signup() {
      const {
        name,
        email,
        password,
        verifyPassword,
      } = this.signupForm;

      if (name && email && password === verifyPassword) {
        this.$store.dispatch('signup', { name, email, password });
        this.signupForm.name = '';
        this.signupForm.email = '';
        this.signupForm.password = '';
        this.signupForm.verifyPassword = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.signup-form {
  margin: 4rem;
  padding: 2rem;
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
