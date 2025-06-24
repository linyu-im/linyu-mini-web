<template>
  <span
    class="gradient-text"
    :style="{ '--gradient-direction': direction }"
    @click="$emit('click')"
  >
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'right',
    },
  },
}
</script>

<style lang="less" scoped>
.gradient-text {
  background: linear-gradient(
    to var(--gradient-direction),
    rgb(var(--primary-color), 0.7),
    rgb(var(--primary-color))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  cursor: pointer;
}
</style>
