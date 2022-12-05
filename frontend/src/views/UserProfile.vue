<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title has-text-centered" id="banner">
          {{ dbayUser?.firstName }} {{ dbayUser?.lastName }} ({{ dbayUser?.userName }})
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
          <p class="has-text-left" id="user-email" v-if="dbayUser?.email">Email address: {{ dbayUser?.email }}</p>
          <p class="has-text-left" id="user-phone" v-if="dbayUser?.phone">Phone number: {{ dbayUser?.phone }}</p>
          <p class="has-text-left" id="user-address" v-if="dbayUser?.address">Address: {{ dbayUser?.address }}</p>
        </div>
      </div>
      <footer class="card-footer">
        <a :href="`/users/${currentUser.preferred_username}/profile/update`" class="card-footer-item" id="update-profile" v-if="dbayUser?.userName === currentUser.preferred_username">Edit profile</a>
        <router-link class="card-footer-item" id="user-items" :to="{ name: 'searchWithParams', params: { keyword: currentUser.preferred_username, searchType: 'username', filterType: 'createTime'} }" >All items on sale</router-link>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DbayUser } from '../../../backend/data'
import { inject, onMounted, ref, Ref } from 'vue';

interface Props {
  username: string
}

interface ProfileResp {
  dbayUser: DbayUser | undefined
}

const props = withDefaults(defineProps<Props>(), {
  username: ''
})

const dbayUser: Ref<DbayUser | undefined> = ref(undefined)

const currentUser: Ref<any> = inject("user")!

async function getUserProfile() {
  let res: ProfileResp = await( await fetch(`/api/users/${props.username}/profile`, {method: 'GET'}) ).json()
  if (!res || !res.dbayUser) {
    console.log(`UserProfile->getUserProfile: failed to get profile ${res}`)
    return
  }
  dbayUser.value = { ...res.dbayUser }
  console.log('UserProfile->getUserProfile:')
  console.log(dbayUser.value)

  if (!dbayUser.value) {
    console.log('User not found')
  }
}

onMounted(getUserProfile)
</script>