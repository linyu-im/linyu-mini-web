<template>
  <input :type="props.type"
         class="linyu-input"
         :placeholder="props.placeholder"
         :style="`width:${props.width};border-radius:${props.radius}`"
         v-model="value"/>
</template>

<script setup>

const props = defineProps({
  placeholder: String,
  type: String,
  width: {
    type: String,
    default: '100%',
  },
  radius: {
    type: String,
    default: '5px',
  }
})
const value = defineModel('value')
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