<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title has-text-centered">
          <!-- TODO: fill username -->
          {{ dbayUser?.firstName }} {{ dbayUser?.lastName }} ({{ dbayUser?.username }})
        </p>
      </div>
    </section>
    <div class="card is-link">
      <header class="card-header">
        <p class="card-header-title">
          User Info:
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <p class="has-text-left">Email address: {{ dbayUser?.email }}</p>
          <p class="has-text-left">Phone number: {{ dbayUser?.phone }}</p>
          <p class="has-text-left">Address: {{ dbayUser?.address }}</p>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">All items on sale</a>
        <a href="#" class="card-footer-item" v-if="dbayUser?.username === currentUser.preferred_username"></a>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DbayUser, dbayUsers } from '../../.dummy/data'
import { inject, onMounted, ref, Ref } from 'vue';

interface Props {
  username: string
}

const props = withDefaults(defineProps<Props>(), {
  username: ''
})

const dbayUser: Ref<DbayUser | undefined> = ref(undefined)

const currentUser = ref({} as any)
inject('user', currentUser)

async function getUserProfile() {
  // TODO: pull user profile from backend
  let user = dbayUsers.find(dUser => dUser.username === props.username)
  dbayUser.value = user

  if (!dbayUser.value) {
    console.log('User not found')
    // TODO: redirect to 404 page
  }
}

onMounted(getUserProfile)
</script>