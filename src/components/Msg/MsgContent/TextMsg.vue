<template>
  <span v-if="isArrayContents" class="text-msg">
    <template v-for="item in contents" :key="item.id">
      <span v-if="item.type === TextContentType.At" class="text-msg-at" :class="{ right: right }">
        {{ `@${getUserInfo(item.content).name}` }}
      </span>
      <span v-if="item.type === TextContentType.Text">
        {{ item.content }}
      </span>
    </template>
  </span>
  <div v-else>
    {{ props.msg.message }}
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { TextContentType } from '@/constant/textContentType.js'

const props = defineProps({ msg: Object, right: Boolean })
const contents = ref()
watch(
  () => props.msg,
  () => {
    try {
      contents.value = JSON.parse(props.msg?.message)
    } catch {
      contents.value = props.msg?.message
    }
  },
  { immediate: true },
)

const isArrayContents = computed(() => Array.isArray(contents.value))

const getUserInfo = (content) => {
  try {
    return JSON.parse(content)
  } catch {
    return content
  }
}
</script>

<style lang="less" scoped>
.text-msg {
  .text-msg-at {
    color: rgba(var(--primary-color));
    font-style: italic;
    margin: 0 2px;
    cursor: pointer;
    font-weight: 600;
    display: inline-block;

    &.right {
      color: white;
    }
  }
}
</style>
