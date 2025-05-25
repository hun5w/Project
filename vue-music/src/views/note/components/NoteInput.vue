<template>
  <div class="p-4 border-b bg-white">
    <textarea
      v-model="text"
      placeholder="分享你此刻的音乐心情~"
      rows="3"
      class="w-full p-2 border rounded resize-none"
    ></textarea>
    <div class="flex justify-end mt-2">
      <button
        @click="submit"
        :disabled="!text.trim()"
        class="bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        发布
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { saveLocalNote } from '@/data/localNotes'

const emit = defineEmits(['submit'])

const text = ref('')

function submit() {
  if (!text.value.trim()) return
  saveLocalNote(text.value.trim())
  emit('submit') // 通知父组件刷新
  text.value = ''
}
</script>
