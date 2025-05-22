<template>
  <button :class="['tag-button', colorClass]" @click="$emit('click')">
    <span class="mr-1">{{ icon }}</span>{{ name }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String
})

const iconMap = {
  '怀旧': '📼',
  '摇滚': '🎸',
  '轻音乐': '🌿',
  '电子': '🎧',
  '华语': '🀄',
  '古典': '🎻',
  '民谣': '🎤',
  '安静': '🛌',
  '流行': '🎶',
  default: '🎵'
}

const colorMap = {
  '怀旧': 'from-yellow-400 to-orange-500',
  '摇滚': 'from-gray-800 to-gray-600',
  '轻音乐': 'from-green-400 to-teal-500',
  '电子': 'from-purple-500 to-pink-500',
  '华语': 'from-red-500 to-pink-400',
  '民谣': 'from-orange-400 to-red-400',
  '古典': 'from-yellow-300 to-yellow-500',
  '安静': 'from-sky-300 to-blue-500',
  '流行': 'from-pink-400 to-fuchsia-500',
  default: 'from-blue-400 to-indigo-500'
}

const icon = computed(() => iconMap[props.name] || iconMap.default)
const colorClass = computed(() => `bg-gradient-to-r ${colorMap[props.name] || colorMap.default}`)
</script>

<style scoped>
.tag-button {
  @apply px-4 py-2 rounded-full text-white text-sm font-medium shadow transition-all duration-200;
}
.tag-button:hover {
  @apply scale-105 shadow-lg;
}
</style>
