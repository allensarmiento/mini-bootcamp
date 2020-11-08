<template>
  <div class="dashboard">
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

    <signup-form v-if="userProfile.role === 'admin'" />

    <div class="dashboard__lessons">
      <h2>Edit Lessons</h2>
      <router-link to="/lesson/1/edit">
        <b-alert class="dashboard__lessons__item" show variant="secondary">
          Edit Lesson 1
        </b-alert>
      </router-link>
      <router-link to="/lesson/2/edit">
        <b-alert class="dashboard__lessons__item" show variant="success">
          Edit Lesson 2
        </b-alert>
      </router-link>
    </div>
  </div>  
</template>

<script>
import { mapState } from 'vuex'
import SignupForm from '../components/SignupForm.vue'

export default {
  name: 'Dashboard',
  components: { SignupForm },
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
</style>
