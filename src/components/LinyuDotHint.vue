<template>
  <div class="dot-hint">
    {{ props.text }}
  </div>
</template>
<script setup>
const props = defineProps({
  text: String
})
</script>
<style lang="less" scoped>
.dot-hint {
  padding: 0 4px;
  min-width: 18px;
  height: 18px;
  background: #ff4c4c;
  color: #FFFFFF;
  font-size: 10px;
  line-height: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  font-weight: 600;
  user-select: none;
}
</style>