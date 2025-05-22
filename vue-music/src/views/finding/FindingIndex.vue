<template>
  <div class="p-4 bg-white min-h-screen">
    <!-- 热门分类 -->
    <section v-if="hotTags.length" class="mb-6">
      <h2 class="text-lg font-bold mb-4 text-red-500">🔥 热门分类</h2>
      <div class="flex flex-wrap gap-3">
        <CategoryButton
            v-for="tag in hotTags"
            :key="tag.name"
            :name="tag.name"
            @click="goToPlaylist(tag.name)"
            />

      </div>
    </section>

    <!-- 分类列表 -->
    <section
      v-for="(subTags, catKey) in groupedTags"
      :key="catKey"
      class="mb-8"
    >
      <h3 class="text-base font-semibold text-gray-800 mb-3">
        {{ categories[catKey] }}
      </h3>
      <div class="flex flex-wrap gap-3">
        <CategoryButton
            v-for="tag in subTags"
            :key="tag.name"
            :name="tag.name"
            @click="goToPlaylist(tag.name)"
            />

      </div>
    </section>
  </div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { getCatList, getHotCatList } from '@/api/sort'
import { useRouter } from 'vue-router'
import CategoryButton from '@/views/finding/components/CategoryButton.vue'

const router = useRouter()

const categories = ref({})
const subTags = ref([])
const hotTags = ref([])

onMounted(async () => {
  const [catRes, hotRes] = await Promise.all([
    getCatList(),
    getHotCatList()
  ])
  categories.value = catRes.data.categories
  subTags.value = catRes.data.sub
  hotTags.value = hotRes.data.tags
})

const groupedTags = computed(() => {
  const result = {}
  subTags.value.forEach(tag => {
    const key = tag.category
    if (!result[key]) result[key] = []
    result[key].push(tag)
  })
  return result
})

function goToPlaylist(tagName) {
  router.push({ path: '/playlist', query: { cat: tagName } })
}
</script>

<style scoped>
.tag-button {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #f3f4f6; /* 灰色背景 */
  color: #374151;             /* 深灰字体 */
  border-radius: 999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.tag-button:hover {
  background-color: #e5e7eb; /* hover 更亮一点 */
  transform: scale(1.05);
  color: #1f2937;
}

.tag-button.hot {
  background-color: #fee2e2;
  color: #b91c1c;
}

.tag-button.hot:hover {
  background-color: #fecaca;
  color: #991b1b;
  transform: scale(1.05);
}
</style>

