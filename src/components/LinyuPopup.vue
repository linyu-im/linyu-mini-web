<template>
  <div v-if="visible" @mousedown.stop class="custom-overlay">
    <div ref="contentRef"
         class="content"
         :style="{
             top: top + 'px',
             left: left + 'px',
             outline: 'none'
           }"
         tabindex="0"
         @blur="handleBlur"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'

const props = defineProps({
  position: Object,
})

const top = ref(0)
const left = ref(0)

const emit = defineEmits(['close'])
const visible = defineModel('visible')
const contentRef = ref()

watch(() => visible.value, () => {
  if (visible.value) {
    nextTick(() => {
      contentRef.value.focus()
      top.value = props.position.top - contentRef.value.offsetHeight
      left.value = props.position.left
    })
  }
})

const handleBlur = () => {
  visible.value = false
  emit('close')
}

const updateWindowSize = () => {
  handleBlur()
}

onMounted(() => {
  window.addEventListener('resize', updateWindowSize);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowSize);
})
</script>

<style lang="less" scoped>
.custom-overlay {
  .content {
    position: absolute;
    z-index: 88;
  }
}
</style>