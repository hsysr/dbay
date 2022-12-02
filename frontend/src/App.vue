<template>
    <div>
      <!-- https://bulma.io/documentation/components/navbar/ -->
      <nav class="navbar" role="navigation" aria-lable="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <strong>DBay</strong>
          </a>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-base">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbar-base" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="/">
              Home
            </a>
            <a class="navbar-item" href="/search">
              Search
            </a>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a v-if="!(user?.name)" class="button is-primary" href="/api/login">
                <strong>Login</strong>
              </a>
              <a v-else class="button is-primary" :href="`/users/${user.preferred_username}/profile`">
                <strong>Profile</strong>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <router-view />
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, provide } from 'vue'

  
  const user = ref({} as any)
  provide("user", user)
  
  onMounted(async () => {
    user.value = await (await fetch("/api/user")).json()
    console.log('user info:')
    console.log(user.value)
    console.log(user.value.name)
  })
  
  function logout() {
    ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
  }
  </script>