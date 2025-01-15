<template>
  <div
    class="tooltip-container"
    :style="{ fontSize: `${fontSize}px` }"
    @mouseover="showTooltip"
    @mouseleave="hideTooltip"
    ref="tooltipContainerRef"
  >
    <slot />
    <Teleport to="body">
      <transition
        name="tooltip-fade"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          class="tooltip"
          :class="`tooltip-${position}`"
          v-if="visible"
          :data-theme="themeStore.theme"
          :style="{
            fontSize: `${fontSize}px`,
            left: tooltipPosition.x + 'px',
            top: tooltipPosition.y + 'px',
          }"
        >
          {{ content }}
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore.js'

const themeStore = useThemeStore()

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value),
  },
  fontSize: {
    type: Number,
    default: 14,
  },
})

const visible = ref(false)
const tooltipContainerRef = ref()
const tooltipPosition = ref({ x: 0, y: 0 })

const calculatePosition = (event) => {
  const element = event.target.getBoundingClientRect()
  const offset = element.height / 2 + 8
  switch (props.position) {
    case 'top':
      return {
        x: element.left + element.width / 2,
        y: element.top - offset,
      }
    case 'bottom':
      return {
        x: element.left + element.width / 2,
        y: element.bottom + offset,
      }
    case 'left':
      return {
        x: element.left - offset,
        y: element.top + element.height / 2,
      }
    case 'right':
      return {
        x: element.right + offset,
        y: element.top + element.height / 2,
      }
  }
}

const showTooltip = (event) => {
  tooltipPosition.value = calculatePosition(event)
  visible.value = true
}

const hideTooltip = () => {
  visible.value = false
}

const onBeforeEnter = (el) => {
  el.style.opacity = 0
  switch (props.position) {
    case 'top':
      el.style.transform = 'translate(-50%, -40%)'
      break
    case 'bottom':
      el.style.transform = 'translate(-50%, -60%)'
      break
    case 'left':
      el.style.transform = 'translate(-40%, -50%)'
      break
    case 'right':
      el.style.transform = 'translate(-60%, -50%)'
      break
  }
}

const onEnter = (el, done) => {
  el.offsetHeight
  el.style.transition = 'all 0.3s ease-out'
  el.style.opacity = 1
  el.style.transform = 'translate(-50%, -50%)'
  el.addEventListener('transitionend', done)
}

const onLeave = (el, done) => {
  el.style.transition = 'all 0.3s ease-in'
  el.style.opacity = 0
  switch (props.position) {
    case 'top':
      el.style.transform = 'translate(-50%, -60%)'
      break
    case 'bottom':
      el.style.transform = 'translate(-50%, -40%)'
      break
    case 'left':
      el.style.transform = 'translate(-60%, -50%)'
      break
    case 'right':
      el.style.transform = 'translate(-40%, -50%)'
      break
  }
  el.addEventListener('transitionend', done)
}
</script>

<style lang="less" scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: fixed;
  z-index: 99;
  background-color: rgb(var(--text-color));
  color: rgb(var(--background-color));
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  will-change: transform, opacity;
}
</style>
