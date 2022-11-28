import Vue from "vue";
import VueRouter from "vue-router";
import App from '@/App.vue'
import Home from '@/views/Home.vue'
import ItemDetail from '@/views/ItemDetail.vue'

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
    },
    {
      path: '/items/:itemId/details',
      component: ItemDetail,
      props(route) {
        return {
          itemId: route.params.itemId
        }
      }
    }
  ]

})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
