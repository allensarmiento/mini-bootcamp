<template>
  <div class="dashboard">
    <navbar />

    <div class="dashboard__lessons">
      <router-link to="/lesson/1">
        <b-alert class="dashboard__lessons__item" show variant="secondary">
          Lesson 1
        </b-alert>
      </router-link>
      <router-link to="/lesson/2">
        <b-alert class="dashboard__lessons__item" show variant="success">
          Lesson 2
        </b-alert>
      </router-link>
    </div>

    <div v-if="userProfile.role === 'admin'" class="signup-form">
      <h3 class="signup-form__title">Sign up</h3>
      <b-form @submit.prevent="signup">
        <b-form-group id="input-group-1" label="Name:" label-for="input-1">
          <b-form-input
            id="input-1"
            class="signup-form__input"
            v-model="signupForm.name"
            required
            placeholder="Enter name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Email address:"
          label-for="input-2"
          description="We'll never share your email with anyone else."
        >
          <b-form-input
            id="input-2"
            class="signup-form__input"
            v-model="signupForm.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Password:" label-for="input-3">
          <b-form-input
            id="input-3"
            class="signup-form__input"
            v-model="signupForm.password"
            type="password"
            required
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>

        <b-form-group 
          id="input-group-4" 
          label="Verify Password:" 
          label-for="input-3"
        >
          <b-form-input
            id="input-4"
            class="signup-form__input"
            v-model="signupForm.verifyPassword"
            type="password"
            required
            placeholder="Enter password again"
          ></b-form-input>
        </b-form-group>

        <b-button class="signup-form__submit" type="submit" variant="primary">Sign Up</b-button>
      </b-form>
    </div>
  </div>  
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Dashboard',
  components: { Navbar },
  data: function() {
    return {
      signupForm: {
        name: '',
        email: '',
        password: '',
        verifyPassword: ''
      }
    }
  },
  computed: mapState(['userProfile']),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    signup() {
      if (
        this.signupForm.email && 
        this.signupForm.password === this.signupForm.verifyPassword
      ) {
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
}
</script>

<style lang="scss" scoped>
  .dashboard {
    font-size: 1.6rem;

    &__navbar {
      font-size: 2rem;

      &__brand {
        font-size: 2rem;
      }

      &__option {
        font-size: 1.8rem;
      }
    }

    &__lessons {
      padding: 4rem;

      &__item {
        text-transform: uppercase;
      }
    }
  }

  .signup-form {
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
