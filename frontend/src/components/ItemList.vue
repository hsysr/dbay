<template>
  <div>
    <ListItem
      v-for="item in itemsList"
      :key="item._id"
      :dbayItem="item"
    >
  </ListItem>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { DbayItem, dbayItems } from '../../.dummy/data'
import ListItem from './ListItem.vue'

let pageOffset = ref(0)
let itemsList = ref([] as DbayItem[])

async function fetchItems() {

  // TODO: change this to fetch from actual backend
  itemsList.value = dbayItems
}

onMounted(fetchItems)

</script>