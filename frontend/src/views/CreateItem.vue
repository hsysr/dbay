<template>
  <div class="container">
    <form>
      <div class="field">
        <label class="label">Item name</label>
        <div class="control">
          <input v-model="itemName" class="input" id="itemname-field" type="text" placeholder="Please enter the name for your item" />
        </div>
      </div>

      <div class="field">
        <label class="label">Price</label>
        <div class="control has-icons-left">
          <input v-model.number="price" class="input" id="price-field" type="number" placeholder="0" />
          <span class="icon is-small is-left">
            <FontAwesomeIcon icon="fa-solid fa-dollar-sign" />
          </span>
        </div>
        <p class="help">
          Please enter the price for your item in dollars
        </p>
      </div>

      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <textarea v-model="description" class="textarea" id="description-field"
            placeholder="Please enter additional description for the item" />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" id="submit-button" @click.prevent="submitForm">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Vue, { inject, Ref } from 'vue'
import { ref } from 'vue'
import { DbayItem, DbayUser } from '../../../backend/data'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import VueRouter from 'vue-router'
import {router} from '../main'

library.add(faDollarSign)
Vue.component('font-awesome-icon', FontAwesomeIcon)

interface Payload {
  dbayItem: Omit<DbayItem, '_id' | 'imageLink'>
}

interface Resp {
  status: string,
  itemId: string
}

const currentUser: Ref<any> = inject("user")!
const itemName = ref('')
const price = ref(0)
const description = ref('')

async function submitForm() {
  let payload: Payload = {
    dbayItem: {
      itemName: itemName.value,
      createdBy: currentUser.value.preferred_username,
      price: price.value,
      description: description.value,
      createTime: new Date()
    }
  }

  let res = await (await fetch(
    '/api/items/create-item',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST', body: JSON.stringify(payload)
    })
  ).json() as Resp
  
  console.log(`CreateItem->submitForm: response from remote is`)
  console.log(res)

  // check if success
  if (res && res.status && res.status === 'ok') {

    // redirect to item details page
    router.push({path: `/items/${res.itemId}/details`})
  } else {
    alert('Failed to create item')
    console.log(payload)
    console.log(currentUser.value)
  }
}

</script>