<template>
    <div>
      <!-- <b-navbar toggleable="lg" type="dark" :variant="user?.roles?.includes('operator') ? 'info' : 'primary'">
        <b-navbar-brand href="#">
          <span v-if="user?.name">Welcome, {{ user.name }}</span>
          <span v-else>Smoothie Stand</span>
        </b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item href="/">All Orders</b-nav-item>
          <b-nav-item v-if="user?.roles?.includes('customer')" href="/customer">My Orders</b-nav-item>
          <b-nav-item v-if="user?.roles?.includes('operator')" href="/operator">My Work Screen</b-nav-item>
          <b-nav-item v-if="user?.name == null" href="/api/login">Login</b-nav-item>
          <b-nav-item v-if="user?.name" @click="logout">Logout</b-nav-item>
          <form method="POST" action="/api/logout" id="logoutForm" />
        </b-navbar-nav>
      </b-navbar> -->

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
              <a class="button is-primary" href="/api/login">
                <strong>Login</strong>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <router-view />
    </div>
  </template>
  
  <!-- <template>
    <div>
      <a href="/api/login">login</a>
      <span v-if="user?.name">Logged in</span>
    </div>
  </template> -->
  <script setup lang="ts">
  import { onMounted, ref, provide } from 'vue'

  
  const user = ref({} as any)
  provide("user", user)
  
  onMounted(async () => {
    user.value = await (await fetch("/api/user")).json()
  })
  
  function logout() {
    ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
  }
  </script>