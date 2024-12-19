<template>
  <div class="avatar" :style="{ backgroundColor,width:size,height:size }">
    {{ displayCharacter }}
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '50px'
  },
  color: {
    type: Number,
    default: -1
  }
});

// 定义背景颜色列表
const colors = ["rgba(248,176,0,0.9)", "rgba(255,83,168,0.9)",
  "rgba(76,155,255,0.9)", "rgba(105,189,68,0.9)", "rgba(138,43,226,0.9)"];

const displayCharacter = computed(() => {
  if (!props.text) return "";
  const firstChar = props.text.trim().charAt(0);
  // 如果是英文字符，则转换为大写
  return /^[a-zA-Z]$/.test(firstChar) ? firstChar.toUpperCase() : firstChar;
});

const backgroundColor = computed(() => {
  if (props.color >= 0) return colors[props.color % colors.length];
  if (!props.text) return colors[0];
  const firstChar = props.text.trim().charAt(0);
  const charCode = firstChar.charCodeAt(0);
  return colors[charCode % colors.length];
});
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
}
</style>
