<template>
  <input
      ref="inputRef"
      :type="props.type"
      class="linyu-input"
      :placeholder="props.placeholder"
      :style="`width:${props.width};
         border-radius:${props.radius};
         height:${props.height};
         font-size:${props.fontSize};
         padding:${props.padding}`"
      v-model="value"
      @keydown.enter="(e)=>emit('keydown.enter',e)"
  />
</template>

<script setup>

import {ref} from "vue";

const inputRef = ref()
const props = defineProps({
  placeholder: String,
  type: String,
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '50px',
  },
  fontSize: {
    type: String,
    default: '18px',
  },
  radius: {
    type: String,
    default: '5px',
  },
  padding: {
    type: String,
    default: '0 10px',
  }
})
const value = defineModel('value')

defineExpose({
  focus() {
    inputRef.value?.focus()
  },
  getInput() {
    return inputRef.value
  }
})

const emit = defineEmits(['keydown.enter'])
</script>

<style scoped lang="less">
.linyu-input {
  padding: 0 10px;
  width: 100%;
  height: 50px;
  font-size: 18px;
  display: flex;
  outline: none;
  background-color: rgb(var(--background-color));
  border: rgba(var(--background-color), 0.5) 2px solid;
  margin-right: 10px;
  color: rgb(var(--text-color));

  &::placeholder {
    color: rgba(var(--text-color), 0.7);;
  }
}
</style>