<template>
  <div
      class="draggable-resizable-window"
      :style="computedStyle"
      @mousedown="startDraggingHeader"
  >
    <div v-if="props.title" class="window-header">
      {{ props.title }}
    </div>
    <div class="window-content" ref="contentRef">
      <slot/>
    </div>
    <div v-if="props.resize" class="resize-handle" @mousedown.stop="startResizing"></div>
  </div>
</template>

<script setup>
import {reactive, computed, onMounted, onBeforeUnmount, ref} from 'vue';

const contentRef = ref(null)

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 200,
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
  rounded: Number
})

const state = reactive({
  top: 100,
  left: 0,
  width: props.width,
  height: props.height,
  dragging: false,
  resizing: false,
  dragStart: {x: 0, y: 0},
  resizeStart: {x: 0, y: 0, width: 0, height: 0},
});

const computedStyle = computed(() => ({
  top: `${state.top}px`,
  left: `${state.left}px`,
  width: `${state.width}px`,
  height: `${state.height}px`,
  position: 'absolute',
  borderRadius: `${props.rounded}px`
}));

// 获取浏览器视口的宽度和高度
const getViewportDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const resetToInitialPosition = () => {
  const viewport = getViewportDimensions();
  state.top = 100;
  if (contentRef.value) {
    state.left = (viewport.width - contentRef.value.getBoundingClientRect().width) / 2;
  }
};

const startDraggingHeader = (event) => {
  state.dragging = true;
  state.dragStart = {x: event.clientX, y: event.clientY};
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
};

const handleDragging = (event) => {
  if (!state.dragging) return;
  const dx = event.clientX - state.dragStart.x;
  const dy = event.clientY - state.dragStart.y;

  const viewport = getViewportDimensions();

  // 计算新的 top 和 left，并限制在视口内
  state.top = Math.max(0, Math.min(state.top + dy, viewport.height - state.height));
  state.left = Math.max(0, Math.min(state.left + dx, viewport.width - state.width));

  state.dragStart = {x: event.clientX, y: event.clientY};
};

const stopDragging = () => {
  state.dragging = false;
  document.removeEventListener('mousemove', handleDragging);
  document.removeEventListener('mouseup', stopDragging);
};

const startResizing = (event) => {
  state.resizing = true;
  state.resizeStart = {
    x: event.clientX,
    y: event.clientY,
    width: state.width,
    height: state.height,
  };
  document.addEventListener('mousemove', handleResizing);
  document.addEventListener('mouseup', stopResizing);
};

const handleResizing = (event) => {
  if (!state.resizing) return;
  const dx = event.clientX - state.resizeStart.x;
  const dy = event.clientY - state.resizeStart.y;

  const viewport = getViewportDimensions();

  // 限制宽度和高度
  state.width = Math.max(100, Math.min(state.resizeStart.width + dx, viewport.width - state.left));
  state.height = Math.max(100, Math.min(state.resizeStart.height + dy, viewport.height - state.top));
};

const stopResizing = () => {
  state.resizing = false;
  document.removeEventListener('mousemove', handleResizing);
  document.removeEventListener('mouseup', stopResizing);
};

// 初始化位置和事件监听
onMounted(() => {
  resetToInitialPosition();

  // 监听窗口大小变化
  window.addEventListener('resize', resetToInitialPosition);
});

// 清理事件监听
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDragging);
  document.removeEventListener('mouseup', stopDragging);
  document.removeEventListener('mousemove', handleResizing);
  document.removeEventListener('mouseup', stopResizing);
  window.removeEventListener('resize', resetToInitialPosition);
});
</script>

<style scoped>
.draggable-resizable-window {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  overflow: hidden;
  z-index: 1000;
  user-select: none;
  max-width: 90%;
}

.window-header {
  color: #fff;
  padding: 8px;
  cursor: grab;
  overflow: hidden;
}

.window-content {
  height: 100%;
  width: 100%;
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
