<template>
  <div
    class="linyu-input-wrapper"
    :style="`width:${props.width};
         border-radius:${props.radius};
         height:${props.height};
         font-size:${props.fontSize};
         padding:${props.padding};
         background-color: ${props.backgroundColor};`"
  >
    <div v-if="props.label" class="linyu-input-label">{{ props.label }}</div>
    <input
      ref="inputRef"
      class="linyu-input"
      :type="props.type"
      :readonly="props.readonly"
      :placeholder="props.placeholder"
      v-model="value"
      @keydown.enter="(e) => emit('keydown.enter', e)"
      @input="handleInput"
    />
    <div v-if="props.limit" class="linyu-input-limit">
      {{ value.toString().trim().length }}/{{ props.limit }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputRef = ref()
const props = defineProps({
  placeholder: String,
  type: String,
  label: String,
  limit: Number,
  readonly: {
    type: Boolean,
    default: false,
  },
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
  },
  backgroundColor: {
    type: String,
    default: 'rgb(var(--background-color))',
  },
})

const value = defineModel('value')

const handleInput = (event) => {
  const inputValue = event.target.value.toString().trim()
  if (props.limit && inputValue.length > props.limit) {
    value.value = inputValue.slice(0, props.limit)
  } else {
    value.value = inputValue
  }
}

defineExpose({
  focus() {
    inputRef.value?.focus()
  },
  getInput() {
    return inputRef.value
  },
})

const emit = defineEmits(['keydown.enter'])
</script>

<style scoped lang="less">
.linyu-input-wrapper {
  padding: 0 10px;
  width: 100%;
  height: 50px;
  font-size: 18px;
  background-color: rgb(var(--background-color));
  border: rgba(var(--background-color), 0.5) 2px solid;
  display: flex;
  align-items: center;
  color: rgb(var(--text-color));

  .linyu-input-label {
    margin-right: 10px;
    min-width: 70px;
    max-width: 70px;
    font-weight: 600;
    flex-shrink: 1;
  }

  .linyu-input {
    width: 100%;
    outline: none;
    background-color: transparent;

    &::placeholder {
      color: rgba(var(--text-color), 0.7);
    }
  }

  .linyu-input-limit {
    width: 50px;
    flex-shrink: 1;
    display: flex;
    justify-content: end;
  }
}
</style>
