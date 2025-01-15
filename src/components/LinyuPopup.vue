<template>
  <div
    v-if="visible"
    @mousedown.stop
    class="linyu-popup"
    :class="{ overlay: props.overlay }"
    @click="handlerOverlay"
  >
    <div
      ref="contentRef"
      class="content"
      :style="{
        top: top + 'px',
        left: left + 'px',
        outline: 'none',
      }"
      tabindex="0"
      @blur="handleBlur"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  position: Object,
  isFocus: {
    type: Boolean,
    default: true,
  },
  overlay: {
    type: Boolean,
    default: false,
  },
})

const top = ref(0)
const left = ref(0)

const emit = defineEmits(['close'])
const visible = defineModel('visible')
const contentRef = ref()

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      nextTick(() => {
        if (props.isFocus) contentRef.value.focus()
        top.value = props.position.top - contentRef.value.offsetHeight
        left.value = props.position.left
      })
    }
  },
)

const handlerOverlay = () => {
  if (props.overlay) {
    handleBlur()
  }
}

const handleBlur = () => {
  visible.value = false
  emit('close')
}

const updateWindowSize = () => {
  handleBlur()
}

onMounted(() => {
  window.addEventListener('resize', updateWindowSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowSize)
})
</script>

<style lang="less" scoped>
.linyu-popup {
  .content {
    position: absolute;
    z-index: 88;
  }

  &.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
