import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from './utilities/firebase';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

let app;

auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      store,
      router,
      render: (h) => h(App),
    }).$mount('#app');
  }

  if (user) {
    store.dispatch('fetchUserProfile', user);
  }
});
