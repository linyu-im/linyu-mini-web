<template>
  <div class="icon-button" @click="(e)=>emit('click',e)">
    <i :class="`iconfont ${props.icon}`" class="text-[22px]"></i>
  </div>
</template>

<script setup>
const props = defineProps(
    {
      icon: {
        required: true,
        type: String,
      }
    },
)
const emit = defineEmits(["click"])
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