import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router'; // eslint-disable-line import/no-cycle
import * as fb from '../utilities/firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userProfile: {},
  },
  getters: {
    isAdmin: (state) => state.userProfile.role === 'admin',
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
  },
  actions: {
    async login({ dispatch }, form) {
      // Sign user in.
      const { user } = await fb.auth
        .signInWithEmailAndPassword(form.email, form.password);

      if (user) {
        // Fetch user profile and set in state.
        dispatch('fetchUserProfile', user);
      }
    },
    async fetchUserProfile({ commit }, user) {
      // Fetch user profile.
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      // Set user profile in state.
      commit('setUserProfile', userProfile.data());

      // Change route to dashboard.
      if (router.currentRoute.path === '/login') {
        router.push('/');
      }
    },
    async signup(dispatch, form) {
      // Sign user up.
      try {
        const { user } = await fb.auth
          .createUserWithEmailAndPassword(form.email, form.password);

        // Create user profile object in userCollection.
        await fb.usersCollection.doc(user.uid).set({
          name: form.name,
          role: 'member',
        });

        // Note: Since the signup form is only available for an admin,
        // don't dispatch fetching user's profile.
      } catch (error) {
        console.log(error);
      }
    },
    async logout({ commit }) {
      await fb.auth.signOut();

      // Clear userProfile and redirect to /login.
      commit('setUserProfile', {});
      router.push('/login');
    },
  },
  modules: {
  },
});

export function useStore() {
  return store;
}

export default store;
