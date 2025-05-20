<template>
  <div class="playlist">
    <h3 class="title">推荐歌单</h3>
    <div class="playlist-grid">
      <div
        v-for="item in playlists"
        :key="item.id"
        class="playlist-item"
      >
        <img :src="item.picUrl" class="cover" />
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlists: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.playlist {
  .title {
    font-size: 16px;
    margin-bottom: 12px;
    font-weight: bold;
  }

  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .playlist-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .cover {
      width: 100%;
      border-radius: 8px;
    }

    .name {
      margin-top: 6px;
      font-size: 13px;
      text-align: center;
      color: #333;
    }
  }
}
</style>
