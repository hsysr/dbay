<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title has-text-centered">
          {{ dbayItem.itemName }}
        </p>
      </div>
    </section>
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
          <ImageWithPopupVue v-for="imgLink, idx in dbayItem.imageLink" :key="idx" :imageLink="imgLink" />
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
import ImageWithPopupVue from '@/components/ImageWithPopup.vue';
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



function closeModal(e: HTMLElement) {
  e.classList.remove('is-active')
}

onMounted(() => {
  getItemDetails()
})
</script>