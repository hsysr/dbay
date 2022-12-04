<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title has-text-centered" id="banner">
          {{ dbayItem.itemName }}
        </p>
      </div>
    </section>
    <article class="message is-dark">
      <div class="message-header">
        <p>Info:</p>
      </div>
      <router-link :to="{ name: 'userProfile', params: {username: dbayItem.createdBy} }"><p class="is-size-3 2rem has-text-left" id="item-seller">Seller: {{ dbayItem.createdBy }}</p></router-link>
      <p class="has-text-left is-size-3" id="item-price">Price: ${{ dbayItem.price }}</p>

    </article>
    <article class="message is-link" v-if="dbayItem.imageLink && dbayItem.imageLink.length > 0">
      <div class="message-header">
        <p>Images:</p>
      </div>
      <div class="message-body">
        <div class="box">
          <ImageWithPopupVue v-for="imgLink, idx in dbayItem.imageLink" :key="idx" :imageLink="imgLink" />
        </div>
      </div>
    </article>

    <article class="message is-success">
      <div class="message-header">
        <p>Description:</p>
      </div>
      <div class="message-body" id="item-description">
        {{ dbayItem.description }}
      </div>
    </article>
    
    <div class="field" v-if="(dbayItem.createdBy === currentUser.preferred_username || currentUserIsAdmin)">
      <a :href="`/items/${dbayItem._id}/update`">
        <button class="button is-link mt-5 ml-3" >Update Item</button>
      </a>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref } from 'vue'
import { DbayItem } from '../../../backend/data'
import ImageWithPopupVue from '../components/ImageWithPopup.vue'

const dbayItem = ref({} as DbayItem)
const currentUser: Ref<any> = inject("user")!
const currentUserIsAdmin: Ref<boolean> = inject("isAdmin")!

interface Props {
  itemId?: string
}

interface ItemDetailsResp {
  result: DbayItem | undefined
}

const props = withDefaults(defineProps<Props>(), {
  itemId: undefined
})

async function getImageBase64() {
  interface ImageStrResp {
    imgStr: string
  }
  let imageArr = [] as string[]
  dbayItem.value.imageLink.forEach(async (link) => {
    let res: ImageStrResp = await ( await fetch(link, {method: 'GET'}) ).json()
    if (!res || !res.imgStr) {
      return
    }

    imageArr.push(res.imgStr)
  })

  dbayItem.value.imageLink = JSON.parse(JSON.stringify(imageArr))
}

async function getItemDetails() {

  let item: ItemDetailsResp = await (await fetch(`/api/items/${props.itemId}/details`, { method:'GET' })).json()

  // let item = dbayItems.find(dItem => dItem._id === props.itemId)
  if (!item || !item.result) {
    console.log(`ItemDetail->getItemDetails: Invalid item id number ${item}`)
    return
  }
  console.log('ItemDetail->getItemDetails: item is')
  console.log(item)
  dbayItem.value = { ...item.result }
  console.log('now dbayitem is')
  console.log(dbayItem.value)

  // add a slash in front of each img link
  dbayItem.value.imageLink = dbayItem.value.imageLink.map(link => `http://127.0.0.1:8080/${link}`)
  console.log(dbayItem.value.imageLink)
}



function closeModal(e: HTMLElement) {
  e.classList.remove('is-active')
}

onMounted(async () => {
  await getItemDetails()
  console.log('usernames')
  console.log(dbayItem.value)
  console.log(currentUser.value.preferred_username)
})
</script>