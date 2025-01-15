<template>
  <div class="text-button" @click="(e) => emit('click', e)">
    {{ props.text }}
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    required: true,
    type: String,
  },
})
const emit = defineEmits(['click'])
</script>

<style lang="less" scoped>
.text-button {
  font-size: 12px;
  border-radius: 5px;
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: rgb(var(--primary-color));
  padding: 2px 6px;
  background-color: rgba(var(--background-color), 0.3);
  user-select: none;
  flex-shrink: 0;

  &:hover {
    background-color: rgb(var(--background-color), 1);
  }
}
</style>
