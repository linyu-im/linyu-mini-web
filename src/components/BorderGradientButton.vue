<template>
  <div
    class="gradient-button"
    :style="{ '--gradient-direction': direction }"
    @click="$emit('click')"
  >
    <div class="justify-center flex items-center">
      <gradient-text>
        <slot />
      </gradient-text>
    </div>
  </div>
</template>

<script>
import GradientText from '@/components/GradientText.vue'

export default {
  components: { GradientText },
  props: {
    direction: {
      type: String,
      default: 'left',
    },
  },
}
</script>

<style lang="less" scoped>
.gradient-button {
  position: relative;
  padding: 6px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  background: transparent;

  &:hover {
    background-color: rgba(var(--primary-color), 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 100px;
    padding: 2px;
    background: linear-gradient(
      to var(--gradient-direction),
      rgb(160, 217, 246),
      rgb(var(--primary-color))
    );
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
}
</style>
