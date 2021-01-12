import Vue from 'vue';
import Vuex from 'vuex';
import {
  signInUser,
  signUpUser,
  getUserProfile,
  logoutUser,
} from '../data/firebase/user';
import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userProfile: {},
  },
  getters: {
    isAdmin: (state) => state.userProfile.role === 'admin',
  },
  mutations: {
    setUserProfile(state, value) {
      state.userProfile = value;
    },
  },
  actions: {
    /**
     * Sign user in and set user profile in state.
     * @param {Vuex} dispatch
     * @param {Object} form
     */
    async login({ dispatch }, form) {
      const user = await signInUser(form);

      if (user) dispatch('fetchUserProfile', user);
    },
    /**
     * Get user profile and set in state.
     * @param {Vuex} commit
     * @param {Object} user
     */
    async fetchUserProfile({ commit }, user) {
      const userProfile = await getUserProfile(user.uid);
      userProfile.uid = user.uid;

      commit('setUserProfile', userProfile);

      if (router.currentRoute.path === '/login') router.push('/');
    },
    /**
     * @param {Vuex} dispatch
     * @param {Object} form
     */
    async signup(dispatch, form) {
      await signUpUser(form);

      // Note: The signup form is currently only available for an admin.
      // Otherwise, dispatch fetching the user's profile.
    },
    async logout({ commit }) {
      await logoutUser();
      commit('setUserProfile', {});
      router.push('/login');
    },
  },
  modules: {},
});
