<template>
  <ul v-if="suggestions.length">
    <li v-for="item in suggestions" :key="item.keyword" @click="select(item.keyword)">
      {{ item.keyword }}
    </li>
  </ul>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getSearchSuggest } from '@/api/search'
const props = defineProps({ keywords: String })
const emit = defineEmits(['select'])

const suggestions = ref([])

watch(() => props.keywords, async (val) => {
  if (val.trim()) {
    const res = await getSearchSuggest(val)
    suggestions.value = res.result?.allMatch || []
  } else {
    suggestions.value = []
  }
})

const select = (keyword) => {
  emit('select', keyword)
}
</script>
