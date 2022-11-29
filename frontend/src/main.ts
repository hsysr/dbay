import Vue from "vue";
import VueRouter from "vue-router";
import App from '@/App.vue'
import Home from '@/views/Home.vue'
import ItemDetail from '@/views/ItemDetail.vue'
import UserProfile from '@/views/UserProfile.vue'
import CreateItem from '@/views/CreateItem.vue'
import UpdateUserProfile from '@/views/UpdateUserProfile.vue'

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
    },
    {
      path: '/users/:username/profile',
      component: UserProfile,
      props(route) {
        return {
          username: route.params.username
        }
      }
    },
    {
      path: '/items/create-item',
      component: CreateItem
    },
    {
      path: '/users/:username/profile/update',
      component: UpdateUserProfile,
      props(route) {
        return {
          username: route.params.username
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
