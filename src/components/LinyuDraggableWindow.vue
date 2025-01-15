<template>
  <div
    class="draggable-resizable-window"
    :style="computedStyle"
    @mousedown="startDraggingHeader"
    @touchstart="startDraggingHeader"
  >
    <div v-if="props.title" class="window-header">
      {{ props.title }}
    </div>
    <div class="window-content" ref="contentRef">
      <slot />
    </div>
    <div
      v-if="props.resize"
      class="resize-handle"
      @mousedown.stop="startResizing"
      @touchstart.stop="startResizing"
    ></div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'

const contentRef = ref(null)

const props = defineProps({
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  drag: {
    type: Boolean,
    default: true,
  },
  resize: {
    type: Boolean,
    default: true,
  },
  title: String,
  rounded: Number,
  refresh: Object,
})

const state = reactive({
  top: 100,
  left: 0,
  width: props.width,
  height: props.height,
  dragging: false,
  resizing: false,
  dragStart: { x: 0, y: 0 },
  resizeStart: { x: 0, y: 0, width: 0, height: 0 },
})

watch(
  () => props.refresh,
  () => {
    nextTick(() => {
      if (props.refresh?.width) {
        state.width = props.refresh.width
      }
      if (props.refresh?.height) {
        state.height = props.refresh.height
      }
    })
  },
)

watch(contentRef, () => {
  if (contentRef.value) {
    const rect = contentRef.value.getBoundingClientRect()
    if (!state.width) state.width = rect.width
    if (!state.height) state.height = rect.height
  }
})

const computedStyle = computed(() => ({
  top: `${state.top}px`,
  left: `${state.left}px`,
  width: `${state.width}px`,
  height: `${state.height}px`,
  position: 'absolute',
  borderRadius: `${props.rounded}px`,
}))

const getViewportDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
})

const resetToInitialPosition = () => {
  const viewport = getViewportDimensions()
  state.top = 100
  if (contentRef.value) {
    state.left = (viewport.width - contentRef.value.getBoundingClientRect().width) / 2
  }
}

const startDraggingHeader = (event) => {
  state.dragging = true
  const isTouch = event.type === 'touchstart'
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  state.dragStart = { x: clientX, y: clientY }

  if (isTouch) {
    document.addEventListener('touchmove', handleDragging)
    document.addEventListener('touchend', stopDragging)
  } else {
    document.addEventListener('mousemove', handleDragging)
    document.addEventListener('mouseup', stopDragging)
  }
}

const handleDragging = (event) => {
  if (!state.dragging) return
  const isTouch = event.type === 'touchmove'
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  const dx = clientX - state.dragStart.x
  const dy = clientY - state.dragStart.y

  const viewport = getViewportDimensions()

  state.top = Math.max(0, Math.min(state.top + dy, viewport.height - state.height))
  state.left = Math.max(0, Math.min(state.left + dx, viewport.width - state.width))

  state.dragStart = { x: clientX, y: clientY }
}

const stopDragging = () => {
  state.dragging = false
  document.removeEventListener('mousemove', handleDragging)
  document.removeEventListener('mouseup', stopDragging)
  document.removeEventListener('touchmove', handleDragging)
  document.removeEventListener('touchend', stopDragging)
}

const startResizing = (event) => {
  state.resizing = true
  const isTouch = event.type === 'touchstart'
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  state.resizeStart = {
    x: clientX,
    y: clientY,
    width: state.width,
    height: state.height,
  }

  if (isTouch) {
    document.addEventListener('touchmove', handleResizing)
    document.addEventListener('touchend', stopResizing)
  } else {
    document.addEventListener('mousemove', handleResizing)
    document.addEventListener('mouseup', stopResizing)
  }
}

const handleResizing = (event) => {
  if (!state.resizing) return
  const isTouch = event.type === 'touchmove'
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  const dx = clientX - state.resizeStart.x
  const dy = clientY - state.resizeStart.y

  const viewport = getViewportDimensions()

  state.width = Math.max(100, Math.min(state.resizeStart.width + dx, viewport.width - state.left))
  state.height = Math.max(100, Math.min(state.resizeStart.height + dy, viewport.height - state.top))
}

const stopResizing = () => {
  state.resizing = false
  document.removeEventListener('mousemove', handleResizing)
  document.removeEventListener('mouseup', stopResizing)
  document.removeEventListener('touchmove', handleResizing)
  document.removeEventListener('touchend', stopResizing)
}

onMounted(() => {
  resetToInitialPosition()
  window.addEventListener('resize', resetToInitialPosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDragging)
  document.removeEventListener('mouseup', stopDragging)
  document.removeEventListener('touchmove', handleDragging)
  document.removeEventListener('touchend', stopDragging)
  document.removeEventListener('mousemove', handleResizing)
  document.removeEventListener('mouseup', stopResizing)
  document.removeEventListener('touchmove', handleResizing)
  document.removeEventListener('touchend', stopResizing)
  window.removeEventListener('resize', resetToInitialPosition)
})
</script>

<style scoped>
.draggable-resizable-window {
  z-index: 1000;
  user-select: none;
  max-width: 90%;
  background-color: #4c9bff;
}

.window-header {
  color: #fff;
  padding: 8px;
  cursor: grab;
  overflow: hidden;
}

.window-content {
}

.resize-handle {
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
  z-index: 1;
}
</style>
