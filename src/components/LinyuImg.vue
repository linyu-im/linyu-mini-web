<template>
  <div class="image-container" :class="{ selected: props.selected }">
    <div v-if="isEmoji" class="emoji" :style="emojiStyle">
      {{ props.src }}
    </div>
    <img v-else draggable="false" :src="props.src" alt="" class="image" :style="imageStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: 'auto',
  },
  height: {
    type: [String, Number],
    default: 'auto',
  },
  selected: {
    type: Boolean,
  },
  src: String,
})
const isEmoji = computed(() => {
  return /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]+$/u.test(
    props.src,
  )
})

const emojiStyle = computed(() => ({
  fontSize: `${(parseInt(props.height) / 5) * 4}px`,
  width: props.width,
  height: props.height,
}))

const imageStyle = computed(() => ({
  width: props.width,
  height: props.height,
}))
</script>

<style scoped>
.image-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  user-select: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(var(--primary-color), 0.2);
  }

  &.selected {
    background-color: rgba(var(--primary-color));
  }

  .emoji {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image {
    display: inline-block;
    max-width: 100%;
    height: auto;
  }
}
</style>
