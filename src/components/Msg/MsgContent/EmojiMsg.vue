<template>
  <div class="emoji-container" :style="imageStyle">
    <img draggable="false" :src="props.src" alt="" class="image" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
  },
  height: {
    type: [String, Number],
  },
  padding: {
    type: [String, Number],
    default: '5px',
  },
  src: String,
})

const imageStyle = computed(() => ({
  width: props.width,
  height: props.height,
  padding: props.padding,
}))
</script>

<style scoped>
.emoji-container {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 5px;
  height: 120px;
  width: 120px;

  .image {
    display: inline-block;
    height: 100%;
  }
}
</style>
