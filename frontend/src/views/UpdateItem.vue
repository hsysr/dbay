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
          <button class="button is-primary" @click.prevent="submitForm">Submit</button>
        </div>
      </div>

    </form>

    <!-- Upload image -->
    <form @submit.prevent="onSubmitImage" enctype="multipart/form-data">
      <div class="field">
        <div class="file is-centered is-boxed is-success has-name">
          <input @change="onSelect" class="file-input" type="file" ref="fileUploadField" />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              {{ uploaderPrompt }}
            </span>
          </span>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" type="submit">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Vue, { computed, inject, onMounted } from 'vue'
import { ref, Ref } from 'vue'
import { DbayItem, DbayUser } from '../../.dummy/data'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import VueRouter from 'vue-router'

library.add(faDollarSign)
Vue.component('font-awesome-icon', FontAwesomeIcon)

interface Payload {
  dbayItem: Omit<DbayItem, 'imageLink'>
}

interface Resp {
  status: string,
  itemId: string
}

interface RefreshResp {
  result: DbayItem | undefined
}

interface Props {
  itemId: string
}

interface SubmitImageResp {
  status: string
}

const props = withDefaults(defineProps<Props>(), {
  itemId: ''
})

const currentUser = ref({} as any)
const itemName = ref('')
const price = ref(0)
const description = ref('')
const fileUploadField: Ref<HTMLInputElement | null> = ref(null)

const imageName = ref('')
let imageData: File | null = null
const uploaderPrompt = computed(() => {
  if (!imageName.value) {
    return 'Choose an image...'
  }

  return imageName.value
})

inject('user', currentUser)

async function submitForm() {
  let payload: Payload = {
    dbayItem: {
      _id: props.itemId,
      itemName: itemName.value,
      createdBy: currentUser.preferred_username,
      price: price.value,
      description: description.value
    }
  }

  let res = await (await fetch(
    '/api/items/update-item',
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT', body: JSON.stringify(payload)
    })
  ).json() as Resp

  console.log(`UpdateItem->submitForm: response from remote is ${res}`)

  // check if success
  if (res && res.status && res.status === 'ok') {
    // const router = new VueRouter()
    // router.push(`/api/items/${res.itemId}/details`)
    await refresh()
  } else {
    // TODO: set an error message
  }
}

async function refresh() {

  let resp: RefreshResp = await (await fetch(`/api/items/${props.itemId}/details`, { method: 'GET' })).json()
  if (!resp || !resp.result) {
    console.log('UpdateItem->refresh: failed to load item details')
    // TODO: redirect to 404 page
    return
  }

  itemName.value = resp.result.itemName
  price.value = resp.result.price
  description.value = resp.result.description

}

async function onSubmitImage() {
  if (!imageData) {
    return
  }
  const formData = new FormData()
  formData.append('file', imageData)

  let res: SubmitImageResp = await (await fetch(`/api/items/${props.itemId}/upload-image`, { headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST', body: formData })).json()
  if (res && res.status && res.status === 'ok') {
    await refresh()
    imageData = null
    imageName.value = ''
  } else {
    console.log(`UpdateItem->onSubmitImage: failed with response ${res}`)
  }
}

async function onSelect() {
  if (!fileUploadField.value || !fileUploadField.value.files) {
    return
  }
  let f = fileUploadField.value.files[0]
  if (f.type.match('image.*')) {
    imageData = f
    imageName.value = f.name
  } else {
    alert('Please provide a image file')
  }
}

onMounted(refresh)

</script>