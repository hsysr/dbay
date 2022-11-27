import Vue from "vue";
import VueRouter from "vue-router";
import App from '@/App.vue'
import Home from '@/views/Home.vue'

import 'bulma/css/bulma.css'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    }
  ]

})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
