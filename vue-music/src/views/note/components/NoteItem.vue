<template>
  <div class="p-4 border-b bg-white">
    <div class="flex items-center mb-2">
      <img :src="item.user?.avatarUrl" class="w-10 h-10 rounded-full mr-2" />
      <div>
        <div class="font-semibold">{{ item.user?.nickname || '匿名用户' }}</div>
        <div class="text-sm text-gray-500">{{ formatTime(item.eventTime) }}</div>
      </div>
    </div>

    <div v-if="isEditing" class="mt-2">
      <textarea v-model="editText" class="w-full p-2 border rounded resize-none"></textarea>
      <div class="flex justify-end space-x-2 mt-2">
        <button @click="cancelEdit" class="text-gray-500">取消</button>
        <button @click="confirmEdit" class="text-red-500">保存</button>
      </div>
    </div>

    <div v-else class="text-gray-800">
      {{ displayText }}
    </div>

    <div v-if="isLocal" class="flex justify-end space-x-4 text-sm text-gray-400 mt-2">
      <button @click="startEdit">编辑</button>
      <button @click="handleDelete">删除</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { updateLocalNote, deleteLocalNote } from '@/data/localNotes'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['refresh'])

const isEditing = ref(false)
const editText = ref('')
const isLocal = computed(() => !props.item.json) // 区分本地与接口数据

function formatTime(time) {
  return new Date(time).toLocaleString()
}

const displayText = computed(() => {
  if (props.item.json) {
    try {
      const json = JSON.parse(props.item.json)
      return json.msg || json.title || '[无内容]'
    } catch {
      return '[解析失败]'
    }
  }
  return props.item.text
})

function startEdit() {
  isEditing.value = true
  editText.value = props.item.text
}

function cancelEdit() {
  isEditing.value = false
}

function confirmEdit() {
  updateLocalNote(props.item.id, editText.value)
  emit('refresh')
  isEditing.value = false
}

function handleDelete() {
  if (confirm('确认删除这条动态？')) {
    deleteLocalNote(props.item.id)
    emit('refresh')
  }
}
</script>
