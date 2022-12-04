<template>
  <div class="container">
    <form>
      <div class="field">
        <label class="label">First name</label>
        <div class="control">
          <input v-model="firstName" class="input" id="firstname-field" type="text" :placeholder="firstName" />
        </div>
      </div>

      <div class="field">
        <label class="label">Last name</label>
        <div class="control">
          <input v-model="lastName" class="input" id="lastname-field" type="text" :placeholder="lastName" />
        </div>
      </div>

      <div class="field">
        <label class="label">Phone number</label>
        <div class="control">
          <input v-model="phoneNumber" class="input" id="phone-field" type="text" :placeholder="phoneNumber" />
        </div>
      </div>

      <div class="field">
        <label class="label">Address</label>
        <div class="control">
          <input v-model="address" class="textarea" id="address-field" :placeholder="address" />
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
import { DbayUser } from '../../../backend/data';
import { onMounted, ref, Ref } from 'vue'

interface Props {
  username: string
}

interface RefreshResp {
  dbayUser: DbayUser
}

interface UpdateResp {
  status: string
}

const props = withDefaults(defineProps<Props>(), {
  username: ''
})

const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const address = ref('')

async function refresh() {
  if (!props.username) {
    console.log(`UpdateUserProfile->refresh: invalid username ${props.username}`)
    return
  }
  let profile = await (await fetch(`/api/users/${props.username}/profile`, { method: 'GET' })).json()
  if (!profile || !profile.dbayUser || profile.dbayUser.userName !== props.username) {
    console.log(`UpdateUserProfile->refresh: Invalid response`)
    console.log(profile)
    return
  }

  firstName.value = profile.dbayUser.firstName
  lastName.value = profile.dbayUser.lastName
  phoneNumber.value = profile.dbayUser.phone ? profile.dbayUser.phone : ''
  address.value = profile.dbayUser.address ? profile.dbayUser.address : ''
}

async function submitForm() {
  let payload = {
    dbayUser: {
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phoneNumber.value,
      address: address.value
    }
  }

  let res: UpdateResp = await (await fetch(`/api/users/${props.username}/profile`, { headers: { 'Content-Type': 'application/json' }, method: 'PUT', body: JSON.stringify(payload) })).json()
  if (!res || !res.status) {
    console.log(`UpdateUserProfile->submitForm: Invalid update response ${payload} -> ${res}`)
  }

  await refresh()
}

onMounted(refresh)
</script>