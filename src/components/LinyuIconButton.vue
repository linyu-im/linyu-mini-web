<template>
  <div class="icon-button" @click="(e) => emit('click', e)" :style="{ width: size, height: size }">
    <i :class="`iconfont ${props.icon} text-[${props.fontSize}]`"></i>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    required: true,
    type: String,
  },
  size: {
    type: String,
    default: '30px',
  },
  fontSize: {
    type: String,
    default: '24px',
  },
})
const emit = defineEmits(['click'])
</script>

<style lang="less" scoped>
.icon-button {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: rgb(var(--text-color));

  &:hover {
    background-color: rgb(var(--background-color));
  }
}
</style>
