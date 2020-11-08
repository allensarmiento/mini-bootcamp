import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import 'es6-promise/auto'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import VueSocketIO from 'vue-socket.io'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Lesson from './components/Lesson.vue'
import { auth } from './utilities/firebase'
import * as fb from './utilities/firebase'

Vue.use(VueRouter)
Vue.use(Vuex)
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/lesson/:lessonNumber',
    name: 'Lesson',
    component: Lesson
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

const store = new Vuex.Store({
  state: {
    userProfile: {}
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    }
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = 
        await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      
      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile',  userProfile.data())

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    },
    async signup(dispatch, form) {
      // sign user up
      try {
      const { user } = 
        await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
      
      // create user profile object in userCollection
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        role: 'member'
      })

      // fetch user profile and set in state
      // ! dispatch('fetchUserProfile', user)
      } catch(error) {
        console.log(error)
      }
    },
    async logout({ commit }) {
      await fb.auth.signOut()

      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    }
  }
})

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'localhost:5000',
// }))

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})
