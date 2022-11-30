<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title has-text-centered">
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
          <p class="has-text-left" v-if="dbayUser?.email">Email address: {{ dbayUser?.email }}</p>
          <p class="has-text-left" v-if="dbayUser?.phone">Phone number: {{ dbayUser?.phone }}</p>
          <p class="has-text-left" v-if="dbayUser?.address">Address: {{ dbayUser?.address }}</p>
        </div>
      </div>
      <footer class="card-footer">
        <a :href="`/search/${dbayUser?.username}/itemName/createTime`" class="card-footer-item">All items on sale</a>
        <a :href="`/users/${currentUser.preferred_username}/profile/update`" class="card-footer-item" v-if="dbayUser?.username === currentUser.preferred_username">Edit profile</a>
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

interface ProfileResp {
  dbayUser: DbayUser | undefined
}

const props = withDefaults(defineProps<Props>(), {
  username: ''
})

const dbayUser: Ref<DbayUser | undefined> = ref(undefined)

const currentUser = ref({} as any)
inject('user', currentUser)

async function getUserProfile() {
  let res: ProfileResp = await( await fetch(`/api/users/${props.username}/profile`, {method: 'GET'}) ).json()
  if (!res || !res.dbayUser) {
    console.log(`UserProfile->getUserProfile: failed to get profile ${res}`)
    return
  }
  dbayUser.value = { ...res.dbayUser }

  if (!dbayUser.value) {
    console.log('User not found')
    // TODO: redirect to 404 page
  }
}

onMounted(getUserProfile)
</script>