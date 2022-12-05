<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-128x128 mr-5" v-if="(props.dbayItem.imageLink.length > 0)">
            <img :src="`/api/images/${props.dbayItem.imageLink[0]}`" alt="item image" />
          </figure>
        </div>
        <div class="tile is-ancestor">
          <div class="tile is-vertical is-8">
            <div class="media-content">
              <p class="title is-4">{{ props.dbayItem.itemName }} ${{ props.dbayItem.price }}</p>
              <p class="subtitle is-6">Item description: {{ props.dbayItem.description }}</p>
            </div>
          </div>
          <div class="tile is-primary">
            <div class="content">
              Seller: {{ props.dbayItem.createdBy }}
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="card-footer">
      <a :href="`/users/${props.dbayItem.createdBy}/profile`" class="card-footer-item">Check Seller Info</a>
      <a :href="'/items/' + props.dbayItem._id + '/details'" class="card-footer-item">View Item Details</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DbayItem } from '../../../backend/data'
interface Props {
  dbayItem: DbayItem
}

const props = withDefaults(defineProps<Props>(), {
  dbayItem: undefined
})
</script>