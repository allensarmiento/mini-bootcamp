import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store'; // eslint-disable-line import/no-cycle
import Dashboard from '../Dashboard/views/Dashboard.vue';
import { auth } from '../utilities/firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(
      /* webpackChunkName: "login" */ '../Login/views/Login.vue'
    ),
  },
  {
    path: '/lesson/:lessonNumber',
    name: 'Lesson',
    component: () => import(
      /* webpackChunkName: "lesson" */ '../Lesson/views/Lesson.vue'
    ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/lesson/:lessonNumber/edit',
    name: 'EditLesson',
    component: () => import(
      /* webpackChunkName: "editLesson" */ '../Lesson/views/Edit.vue'
    ),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const requiresAdmin = to.matched.some((x) => x.meta.requiresAdmin);

  // If user is signed in and trying to go to the login page,
  // redirect to home.
  if (auth.currentUser && to.path === '/login') {
    next('/');
  } else if (to.path === '/login') {
    next();
  } else if (requiresAuth && !auth.currentUser) {
    next('/login');
  } else if (requiresAdmin && !store.getters.isAdmin) {
    next('/');
  } else {
    console.log('next');
    next();
  }
});

export default router;
