<template>
  <b-navbar class="nav__navbar" toggleable="lg" type="dark">
    <b-navbar-brand class="nav__navbar__brand">
      Mini Bootcamp
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item>
          <router-link 
            to="/" 
            class="nav__navbar__link"
          >
            Home
          </router-link>
        </b-nav-item>

        <b-nav-item-dropdown class="nav__navbar__options" right>
          <template #button-content>
            <em>{{ userProfile.name }}</em>
          </template>
          <b-dropdown-item 
            class="nav__navbar__option" 
            href="#" 
            disabled
          >
            Profile
          </b-dropdown-item>
          <b-dropdown-item class="nav__navbar__option" @click="logout">
            Sign Out
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Navbar',
  computed: mapState(['userProfile']),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
  }
}
</script>

<style lang="scss" scoped>
  .nav {
    font-size: 1.6rem;

    &__navbar {
      background-color: var(--dark-primary-color);
      font-size: 2rem;

      &__brand {
        font-size: 2rem;
      }

      &__link {
        color: var(--divider-color);

        &:hover {
          color: var(--text);
          text-decoration: none;
        }
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
