<template>
  <div>
    <div v-if="props.itemList">
      <ListItem
      v-for="item in props.itemList"
      :key="item._id"
      :dbayItem="item"
    >
  </ListItem>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { DbayItem } from '../../../backend/data'
import ListItem from './ListItem.vue'

let pageOffset = ref(0)
let itemsList = ref([] as DbayItem[])

interface Props {
  itemList: DbayItem[]
}

const props = withDefaults(defineProps<Props>(), {
  itemList: undefined
})

</script>