<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="hero-body">


        <p class="title has-text-centered">
          {{ dbayItem.itemName }}
        </p>
      </div>
      <!-- <Gallery :images="itemImages" :imageWidth="720" :imageHeight="'auto'" :popUpMaxWidth="720" :mdCols="4" :smCols="4"
        :xsCols="6" :lgCols="2" /> -->

    </section>

    <!-- TODO: use sidebar for seller contact info -->
    <article class="message is-dark">
      <div class="message-header">
        <p>Info:</p>
      </div>
      <p class="is-size-3 2rem has-text-left">Seller: {{ dbayItem.createdBy }}</p>
      <p class="has-text-left is-size-3">Price: ${{ dbayItem.price }}</p>

    </article>

    <article class="message is-link">
      <div class="message-header">
        <p>Images:</p>
      </div>
      <div class="message-body">
        <div class="box" v-if="dbayItem.imageLink && dbayItem.imageLink.length > 0">
          <figure v-for="imgLink in dbayItem.imageLink" :key="imgLink" class="image is-128x128">
            <img :src="imgLink" />
          </figure>
        </div>
      </div>

    </article>

    <article class="message is-success">
      <div class="message-header">
        <p>Description:</p>
      </div>
      <div class="message-body">
        {{ dbayItem.description }}
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { DbayItem, dbayItems } from '../../.dummy/data'
// import Gallery from 'vuejs-image-gallery'
// import VueSilentbox from 'vue-silentbox'
const dbayItem = ref({} as DbayItem)

interface Props {
  itemId?: string
}

interface ImageRepr {
  id: number,
  imgSrc: string
}

const props = withDefaults(defineProps<Props>(), {
  itemId: undefined
})

// const itemImages = computed(() => {
//   return dbayItem.value.imageLink.map((imgLink, idx) => { return { id: idx, imgSrc: imgLink } }) as ImageRepr[]
// })

const galleryImages = computed(() => {
  if (!dbayItem.value.imageLink) {
    return undefined
  }
  return dbayItem.value.imageLink.map(imgLink => { src: imgLink }) as any[]
})

async function getItemDetails() {
  // TODO: pull data from actual server
  // let item = await fetch()

  let item = dbayItems.find(dItem => dItem._id === props.itemId)
  if (!item) {
    alert('Invalid item id number')
    return
  }
  console.log(item)
  dbayItem.value = item
}

onMounted(getItemDetails)
</script>