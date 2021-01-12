<template>
  <BNavbar class="navbar" toggleable="sm" type="dark">
    <BNavbarBrand class="navbar__brand">
      Teaching Suite
    </BNavbarBrand>

    <BNavbarToggle target="nav-collapse" />

    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav class="ml-auto">
        <BNavItem>
          <router-link to="/" class="navbar__link">
            Home
          </router-link>
        </BNavItem>

        <BNavItemDropdown class="navbar__options" right>
          <template #button-content>
            <em>{{ userProfile.name }}</em>
          </template>

          <BDropdownItem
            class="navbar__option"
            href="#"
            disabled
          >
            Profile
          </BDropdownItem>

          <BDropdownItem class="navbar__option" @click="logout">
            Sign Out
          </BDropdownItem>
        </BNavItemDropdown>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
</template>

<script>
import { mapState } from 'vuex';
import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BCollapse,
  BNavbarNav,
  BNavItem,
  BNavItemDropdown,
  BDropdownItem,
} from 'bootstrap-vue';

export default {
  name: 'Navbar',
  components: {
    BNavbar,
    BNavbarBrand,
    BNavbarToggle,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavItemDropdown,
    BDropdownItem,
  },
  computed: mapState(['userProfile']),
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: var(--dark-primary-color);
  font-size: 2rem;

  &__brand {
    font-size: 2rem;
  }

  &__link {
    color: var(--text-light-grey);

    &:hover {
      color: var(--text-light);
    }
  }

  &__option {
    font-size: 1.8rem;
  }
}
</style>
