<template>
  <figure>
    <img :src="props.imageLink" @click.prevent="setModalActive" class="image is-128x128" />
    <div class="modal" ref="modalDiv">
      <div class="modal-backgroud" ref="modalBackgroundDiv" @click.prevent="setModalInactive"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Item Image
          </p>
          <button class="delete" aria-label="close" ref="modalCloseButton"
            @click.prevent="setModalInactive">
            ::before
            ::after
          </button>
        </header>
        <section class="modal-card-body">
          <p class="image">
            <img :src="imageLink" />
          </p>
          <button v-if="props.isEdit" class="button is-danger" @click="$emit('delete-img', imageLink)" >Delete image</button>
        </section>

      </div>

    </div>
  </figure>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'

interface Props {
  imageLink: string,
  isEdit: boolean
}

const props = withDefaults(defineProps<Props>(), {
  imageLink: '',
  isEdit: false
})

const modalDiv: Ref<HTMLElement | null> = ref(null)
const modalBackgroudDiv: Ref<HTMLElement | null> = ref(null)


function setModalActive() {
  if (!modalDiv.value) {
    console.log('Target modal element is null or undefined')
    return
  }

  modalDiv.value.classList.add('is-active')
}

function setModalInactive() {
  if (!modalDiv.value) {
    console.log('Target modal element is null or undefined')
    return
  }

  modalDiv.value.classList.remove('is-active')
}
</script>