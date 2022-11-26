import Vue from "vue";
import VueRouter from "vue-router";
import App from '@/App.vue'

Vue.config.productionTip = false
Vue.config.devtools = true

const router = new VueRouter({})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
