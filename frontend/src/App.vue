<template>
  <div>
    <!-- https://bulma.io/documentation/components/navbar/ -->
    <nav class="navbar" role="navigation" aria-lable="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <strong>DBay</strong>
        </a>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-base"
          ref="navbarBurger" @click="onExpandBurger">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar-base" class="navbar-menu" ref="navbarMenu">
        <div class="navbar-start">
          <a class="navbar-item" id="nav-home" href="/">
            Home
          </a>
          <a class="navbar-item" id="nav-search" href="/search">
            Search
          </a>
          <a v-if="user?.preferred_username" class="navbar-item" id="nav-create-item" href="/items/create-item">
            Create item
          </a>
          <p v-if="isAdmin" class="navbar-item" id="nav-is-admin">Admin user</p>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a v-if="!(user?.preferred_username)" class="button is-primary" id="nav-login" href="/api/login">
                <strong>Login</strong>
              </a>
              <div v-else>
                <a class="button is-primary" :href="`/users/${user.preferred_username}/profile`" id="profile-button">
                  <strong>Profile</strong>
                </a>
                <a class="button is-warning" @click="logout" id="logout-button"><strong>Logout</strong></a>
                <form method="POST" action="/api/logout" id="logoutForm" />

              </div>
            </div>
          </div>
        </div>
      </div>


    </nav>

    <router-view />
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import { router } from './main'

const user = ref({} as any)
provide("user", user)

const isAdmin = ref(false)
provide("isAdmin", isAdmin)

const navbarMenu = ref(null as HTMLElement | null)
const navbarBurger = ref(null as HTMLElement | null)

function onExpandBurger() {
  if (navbarMenu.value) {
    navbarMenu.value.classList.toggle('is-active')
  }

  if (navbarBurger.value) {
    navbarBurger.value.classList.toggle('is-active')
  }
}

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
  console.log('user info:')
  console.log(user.value)
  console.log(user.value.name)

  interface IsAdminResp {
    isAdmin: boolean
  }
  let res: IsAdminResp = await (await fetch('/api/users/is-admin', { method: 'GET' })).json()
  console.log('isAdmin')
  console.log(res)
  console.log(user.value.roles)
  isAdmin.value = res.isAdmin
})

async function logout() {
  ; (window.document.getElementById('logoutForm') as HTMLFormElement).submit()
  // await fetch('/api/logout', { method: 'POST' })

}
</script>