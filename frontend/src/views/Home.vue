<template>
  <div>
    <ItemList :itemList="itemList"></ItemList>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import ItemList from '../components/ItemList.vue'
import { searchItems } from '@/helper';
import { DbayItem } from '../../../backend/data';

const itemList = ref([] as DbayItem[])

async function refresh() {
  let res = await searchItems('')
  itemList.value = { ...res.items }
}

onMounted(refresh)

</script>