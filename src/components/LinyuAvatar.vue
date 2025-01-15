<template>
  <div class="avatar" :style="{ backgroundColor, width: size, height: size }">
    <img v-if="info?.avatar && !hasError" :src="info?.avatar" alt="" @error="hasError = true" />
    <template v-else>
      {{ displayCharacter }}
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const hasError = ref(false)

const props = defineProps({
  info: Object,
  size: {
    type: String,
    default: '50px',
  },
  color: {
    type: Number,
    default: -1,
  },
})

watch(
  () => props.info.avatar,
  () => {
    hasError.value = false
  },
)

// 定义背景颜色列表
const colors = [
  'rgba(248,176,0,0.9)',
  'rgba(255,83,168,0.9)',
  'rgba(76,155,255,0.9)',
  'rgba(105,189,68,0.9)',
  'rgba(138,43,226,0.9)',
]

const displayCharacter = computed(() => {
  if (!props.info?.name) return ''
  const firstChar = props.info.name.trim().charAt(0)
  // 如果是英文字符，则转换为大写
  return /^[a-zA-Z]$/.test(firstChar) ? firstChar.toUpperCase() : firstChar
})

const backgroundColor = computed(() => {
  if (props.color >= 0) return colors[props.color % colors.length]
  if (!props.info?.name) return colors[0]
  const firstChar = props.info?.name.trim().charAt(0)
  const charCode = firstChar.charCodeAt(0)
  return colors[charCode % colors.length]
})
</script>

<style scoped>
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
  user-select: none;
  overflow: hidden;
}
</style>
