<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

const value = ref('')

const { path } = useRoute().params

function debounce(fn, delay) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}

function getContent() {
  fetch(`http://localhost:3000/retrieve/${path}`)
    .then((response) => {
      if (!response.ok) throw new Error('网络请求失败')
      return response.json()
    })
    .then((data) => {
      value.value = data.content
    })
    .catch((error) => {
      console.error('请求失败：', error)
    })
}

function sendContent() {
  fetch('http://localhost:3000/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path,
      content: value.value
    })
  })
    .then((response) => {
      if (!response.ok) throw new Error('网络请求失败')
      return response.json()
    })
    .then((data) => {})
    .catch((error) => {
      console.error('请求失败：', error)
    })
}

const debounced = debounce(sendContent, 1000)

onBeforeMount(() => {
  getContent()
})
</script>

<template>
  <textarea class="input" v-model="value" @input="debounced"></textarea>
</template>

<style>
.input {
  width: 100%;
  height: 100%;
  resize: none;
}
</style>
