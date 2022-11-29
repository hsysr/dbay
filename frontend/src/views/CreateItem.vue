<template>
  <div class="container">
    <!-- TODO: bind to v-model and add listeners -->
    <form>
      <div class="field">
        <label class="label">Item name</label>
        <div class="control">
          <input v-model="itemName" class="input" type="text" placeholder="Please enter the name for your item" />
        </div>
      </div>

      <div class="field">
        <label class="label">Price</label>
        <div class="control has-icon-left">
          <input v-model="price" class="input" type="number" :number="true" placeholder="0" />
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
          <textarea v-model="description" class="textarea"
            placeholder="Please enter additional description for the item" />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" @click.prevent="">Submit</button>
        </div>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import Vue, { inject } from 'vue'
import { ref } from 'vue'
import { DbayItem, DbayUser } from '../../.dummy/data'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import VueRouter from 'vue-router'

library.add(faDollarSign)
Vue.component('font-awesome-icon', FontAwesomeIcon)

interface Payload {
  username: string,
  dbayItem: Omit<DbayItem, '_id' | 'imageLink'>
}

interface Resp {
  status: string,
  itemId: string
}

const currentUser = ref({} as any)
const itemName = ref('')
const price = ref(0)
const description = ref('')

inject('user', currentUser)

async function submitForm() {
  let payload: Payload = {
    username: currentUser.preferred_username,
    dbayItem: {
      itemName: itemName.value,
      createdBy: currentUser.preferred_username,
      price: price.value,
      description: description.value
    }
  }

  let res = await (await fetch(
    '/api/items/create-item',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST', body: JSON.stringify(payload)
    })
  ).json() as Resp
  
  console.log(`CreateItem->submitForm: response from remote is ${res}`)

  // check if success
  if (res && res.status && res.status === 'ok') {
    const router = new VueRouter()
    router.push(`/api/items/${res.itemId}/details`)
  } else {
    // TODO: set an error message
  }
}

</script>