// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import mui from './assets/mui/js/mui.js'
import jq from 'jquery'
Vue.prototype.$=jq;

Vue.config.productionTip = false;
Vue.prototype.mui = mui;

import Axios from 'axios'
Vue.prototype.$axios=Axios;


/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
