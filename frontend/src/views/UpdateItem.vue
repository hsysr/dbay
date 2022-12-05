<template>
  <div class="container">
    <form>
      <div class="field">
        <label class="label">Item name</label>
        <div class="control">
          <input v-model="itemName" class="input" type="text" placeholder="Please enter the name for your item"/>
        </div>
      </div>

      <div class="field">
        <label class="label">Price</label>
        <div class="control has-icon-left">
          <input v-model.number="price" class="input" type="number" :number="true" placeholder="0"/>
          <span class="icon is-small is-left">
            <FontAwesomeIcon icon="fa-solid fa-dollar-sign"/>
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
                    placeholder="Please enter additional description for the item"/>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" @click.prevent="submitForm">Submit</button>
        </div>
      </div>

    </form>

    <article class="message is-link" v-if="imageLinks && imageLinks.length > 0">
      <div class="message-header">
        <p>Images:</p>
      </div>
      <div class="message-body">
        <div class="box">
          <ImageWithPopup v-for="(imgRepr, idx) in imgReprs" :key="idx" :imageLink="imgRepr.b64" :imageId="imgRepr.id"
                          :isEdit="true" @delete-img="deleteImage"/>
        </div>
      </div>
    </article>

    <!-- Upload image -->
    <form @submit.prevent="onSubmitImage" enctype="multipart/form-data">
      <div class="field">
        <label class="file-label">
          <div class="file is-boxed is-success has-name">
            <input @change="onSelect" class="file-input" type="file" ref="fileUploadField"/>
            <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              {{ uploaderPrompt }}
            </span>
          </span>
          </div>
        </label>

      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" type="submit">Submit</button>
        </div>
      </div>
    </form>
    <div class="field">
      <div class="control">
        <button class="button is-danger" id="delete-attempt" @click="onClickDeleteButton">Delete Item</button>
        <div class="message is-danger" v-if="isDeleteButtonClicked">
          <div class="message-header">
            Do you really wish to delete the item?
          </div>
          <div class="message-body">
            <button class="button is-danger" id="delete-confirm" @click="deleteItem">DELETE</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Vue, {computed, inject, onMounted} from 'vue'
import {ref, Ref} from 'vue'
import {DbayItem, DbayUser} from '../../../backend/data'
import ImageWithPopup from '../components/ImageWithPopup.vue'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faDollarSign} from '@fortawesome/free-solid-svg-icons'
import {router} from '../main'
import {ImgRepr} from '../helper'

library.add(faDollarSign)
Vue.component('font-awesome-icon', FontAwesomeIcon)

interface Payload {
  dbayItem: Omit<DbayItem, 'imageLink'>
}

interface Resp {
  status: string,
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

interface DeleteResp {
  status: string
}

const props = withDefaults(defineProps<Props>(), {
  itemId: ''
})

const currentUser: Ref<any> = inject("user")!
const itemName = ref('')
const price = ref(0)
const description = ref('')
const fileUploadField: Ref<HTMLInputElement | null> = ref(null)
const date = ref(new Date())
const isDeleteButtonClicked = ref(false)
const imageLinks = ref([] as string[])
const createdBy = ref('')

const imageName = ref('')
const imgReprs = ref([] as ImgRepr[])


let imageData: string | undefined = undefined
const uploaderPrompt = computed(() => {
  if (!imageName.value) {
    return 'Choose an image...'
  }

  return imageName.value
})

async function submitForm() {
  let payload: Payload = {
    dbayItem: {
      _id: props.itemId,
      itemName: itemName.value,
      createdBy: createdBy.value,
      price: price.value,
      description: description.value,
      createTime: date.value
    }
  }

  let res = await (await fetch(
          '/api/items/update-item',
          {
            headers: {'Content-Type': 'application/json'},
            method: 'PUT', body: JSON.stringify(payload)
          })
  ).json() as Resp

  console.log(`UpdateItem->submitForm: response from remote is`)
  console.log(payload)
  console.log(res)

  // check if success
  if (res && res.status && res.status === 'ok') {
    await refresh()
  } else {
    // TODO: set an error message
    alert('Update item failed')
  }
}

async function getImageBase64() {
  interface ImageStrResp {
    imgStr: string
  }

  // let imageArr = [] as string[]
  imgReprs.value = []

  for (let link of imageLinks.value) {
    let res: ImageStrResp = await (await fetch(link, {method: 'GET'})).json()
    if (!res || !res.imgStr) {
      return
    }

    // imageArr.push(res.imgStr)
    imgReprs.value.push({id: link, b64: res.imgStr})
  }


  // imageLinks.value = JSON.parse(JSON.stringify(imageArr))
}

async function refresh() {

  let resp: RefreshResp = await (await fetch(`/api/items/${props.itemId}/details`, {method: 'GET'})).json()
  if (!resp || !resp.result) {
    console.log('UpdateItem->refresh: failed to load item details')
    // TODO: redirect to 404 page
    return
  }

  itemName.value = resp.result.itemName
  price.value = resp.result.price
  description.value = resp.result.description
  date.value = resp.result.createTime
  isDeleteButtonClicked.value = false
  createdBy.value = resp.result.createdBy
  // imageLinks.value = resp.result.imageLink.map(link => `http://127.0.0.1:8080/${link}`)
  imageLinks.value = resp.result.imageLink.map(link => `/api/images/${link}`)
  await getImageBase64()

}

async function onSubmitImage() {
  if (!imageData) {
    return
  }
  const formData = new FormData()
  formData.append('file', imageData)

  interface SubmitImageReq {
    imgStr: string
  }

  let payload: SubmitImageReq = {
    imgStr: imageData
  }

  console.log('payload is')
  console.log(JSON.stringify(payload))

  let res: SubmitImageResp = await (await fetch(`/api/items/${props.itemId}/upload-image`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })).json()
  if (res && res.status && res.status === 'ok') {
    await refresh()
    imageData = undefined
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
    let reader = new FileReader()
    reader.onload = () => {
      imageData = reader.result?.toString()
    }
    reader.onloadend = () => {
      imageData = reader.result?.toString()
    }
    reader.readAsDataURL(f)


    // imageData = f
    imageName.value = f.name
  } else {
    alert('Please provide a image file')
  }
}

async function deleteItem() {
  let res: DeleteResp = await (await fetch(`/api/items/${props.itemId}/remove-item`, {method: 'DELETE'})).json()
  if (!res || !res.status || res.status !== 'ok') {
    console.log(`UpdateItem->deleteItem: failed to delete item`)
    console.log(res)
    return
  }
  router.push({path: '/'})
}

async function onClickDeleteButton() {
  isDeleteButtonClicked.value = !isDeleteButtonClicked.value
}

async function deleteImage(imgLink: string) {
  const expr = /\/api\/images\/(.+)/i
  let matchResult = imgLink.match(expr)

  if (!matchResult) {
    console.log('UpdateItem->deleteImage: invalid image link')
    return
  }

  imgLink = matchResult[1]


  interface DeleteImageResp {
    status: string
  }

  console.log(`Trying to delete ${imgLink}`)
  let res: DeleteImageResp = await (await fetch(`/api/items/${props.itemId}/remove-image/${imgLink}`, {method: 'DELETE'})).json()
  if (!res || !res.status || res.status !== 'ok') {
    console.log(`UpdateItem->deleteImage: failed to delete image ${imgLink}`)
    console.log(res)
    return
  }

  await refresh()
}

onMounted(refresh)

</script>