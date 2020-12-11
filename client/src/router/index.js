import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../Dashboard/views/Dashboard.vue';
import { authenticatedUser, isAdmin } from '../data/firebase/user';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/lesson/:lessonNumber',
    name: 'Lesson',
    component: () => import(
      /* webpackChunkName: "lesson" */ '../Lesson/views/Lesson.vue'
    ),
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(
      /* webpackChunkName: "login" */ '../Auth/views/Login.vue'
    ),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = 'Teaching Suite';

  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const requiresAdmin = to.matched.some((x) => x.meta.requiresAdmin);

  // If user is signed in and trying to go to the login page, redirect
  // to home.
  if (authenticatedUser() && to.path === '/login') {
    next('/');
  } else if (to.path === '/login') {
    next();
  } else if (requiresAuth && !authenticatedUser()) {
    next('/login');
  } else if (requiresAdmin) {
    const adminUser = await isAdmin(authenticatedUser().uid);

    if (adminUser) next();
    else next('/');
  } else {
    next();
  }
});

export default router;
