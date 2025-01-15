<template>
  <div class="loading-dots">
    <span v-for="n in dotsCount" :key="n" :class="['dot', { active: currentDot === n - 1 }]">
      ·
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  dotsCount: {
    type: Number,
    default: 3,
  },
  interval: {
    type: Number,
    default: 300,
  },
})

const currentDot = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    currentDot.value = (currentDot.value + 1) % props.dotsCount
  }, props.interval)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  height: 10px;
}

.dot {
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
}

.dot.active {
  opacity: 1;
}
</style>
