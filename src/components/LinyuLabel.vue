<template>
  <div ref="contentRef" class="linyu-label">
    <slot />
  </div>
</template>
<script setup>
import { nextTick, ref, watch } from 'vue'

const contentRef = ref()
watch(contentRef, async () => {
  if (contentRef.value) {
    await nextTick()
    const width = contentRef.value.offsetWidth
    contentRef.value.style.right = `-${width + 4}px`
  }
})
</script>

<style>
.linyu-label {
  font-size: 12px;
  padding: 1px 5px;
  background-color: rgba(var(--primary-color), 0.1);
  color: rgba(var(--primary-color));
  user-select: none;
  white-space: nowrap;
  z-index: 1;
  border-radius: 5px;
  font-weight: 600;
  border: 1px solid rgba(var(--primary-color), 1);
}
</style>
