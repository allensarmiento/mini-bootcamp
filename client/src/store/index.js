import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '../data/firebase';

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
    async login({ dispatch }, form) {
      const { email, password } = form;
      const { user } = await auth.signInWithEmailAndPassword(email, password);

      if (user) {
        dispatch('fetchUserProfile', user);
      }
    },
    fetchUserProfile() {},
  },
  modules: {
  },
});
