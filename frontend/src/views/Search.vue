<template>
  <div class="container">
    <form>
      <div class="field">
        <label class="label">Keyword</label>
        <div class="control">
          <input v-model="keyword" class="input" id="search-keyword-field" type="text" />
        </div>
      </div>

      <div class="select">
        <select v-model="searchType">
          <option value="itemName">Search by item name</option>
          <option value="username">Search by username</option>
        </select>
      </div>

      <div class="select">
        <select v-model="filterType">
          <option value="createTime">Sort by time created</option>
          <option value="priceHighToLow">Sort by price (high to low)</option>
          <option value="priceLowToHigh">Sort by price (low to high)</option>
        </select>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" id="search-button" @click.prevent="doSearch">Search</button>
        </div>
      </div>
    </form>
    <div id="search-results">
      <ItemList v-if="(items.length > 0)" :itemList="items"></ItemList>
      <p v-else>No items found</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DbayItem } from '../../../backend/data';
import { SearchResult, searchItems } from '../helper'
import ItemList from '@/components/ItemList.vue'

interface Props {
  paramKeyword: string,
  paramSearchType: string,
  paramFilterType: string
}

interface SearchPayload {
  searchType: string,
  keyword: string,
  sortBy: string
}

const props = withDefaults(defineProps<Props>(), {
  paramKeyword: '',
  paramSearchType: 'itemName',
  paramFilterType: 'createTime',
})

const keyword = ref(props.paramKeyword)
const searchType = ref(props.paramSearchType)
const filterType = ref(props.paramFilterType)
// const offset = ref(props.offset)
const items = ref([] as DbayItem[])

async function doSearch() {
  let payload: SearchPayload = {
    searchType: searchType.value,
    keyword: keyword.value,
    sortBy: filterType.value,
  }


  let res = await searchItems(keyword.value, searchType.value, filterType.value)
  if (!res || !res.items) {
    console.log(`Search->refresh: search failed ${payload} $res`)
    return
  }
  console.log('Search->doSearch:')
  console.log('search res:')
  console.log(res)
  console.log('items:')
  items.value = res.items
  console.log(items.value)
}


onMounted(doSearch)

</script>