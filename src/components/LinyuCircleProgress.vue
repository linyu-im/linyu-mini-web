<template>
  <div class="circle-progress-wrapper">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="circle-progress">
      <!-- 背景圆 -->
      <circle
        class="circle-bg"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- 进度圆 -->
      <circle
        class="circle-progress-bar"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference - (progress / 100) * circumference"
        stroke-linecap="round"
      />
    </svg>
    <div class="progress-text">{{ progress }}%</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  },
  size: {
    type: Number,
    default: 100,
  },
  strokeWidth: {
    type: Number,
    default: 10,
  },
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
</script>

<style scoped>
.circle-progress-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  color: #ffffff;
}

.circle-progress {
  transform: rotate(-90deg);
}

.circle-bg {
  stroke: rgba(255, 255, 255, 0.8);
}

.circle-progress-bar {
  stroke: rgb(var(--primary-color));
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  font-size: 14px;
  font-weight: bold;
}
</style>
