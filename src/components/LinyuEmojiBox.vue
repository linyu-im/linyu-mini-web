<template>
  <div class="emoji-box">
    <div class="emoji-content">
      <div v-for="(emoji, index) in currentEmojiList" :key="index">
        <linyu-tooltip :content="emoji.name">
          <linyu-img
            @click="() => handlerEmoji(emoji.icon)"
            :src="emoji.icon"
            width="32px"
            height="32px"
          />
        </linyu-tooltip>
      </div>
    </div>
    <div class="emoji-type">
      <div v-for="(emoji, index) in emojis" :key="index">
        <linyu-tooltip :content="emoji.name">
          <linyu-img
            :src="emoji.icon"
            width="28px"
            height="28px"
            :selected="index === currentSelectedIndex"
            @click="currentSelectedIndex = index"
          />
        </linyu-tooltip>
      </div>
    </div>
  </div>
</template>
<script setup>
import emojis from '@/emoji/emoji.js'
import LinyuImg from '@/components/LinyuImg.vue'
import LinyuTooltip from '@/components/LinyuTooltip.vue'
import { ref, watch } from 'vue'

const currentSelectedIndex = ref(0)
const currentEmojiList = ref([])
const emit = defineEmits(['onEmoji'])

watch(
  currentSelectedIndex,
  () => {
    currentEmojiList.value = emojis[currentSelectedIndex.value].list
  },
  { immediate: true },
)

const handlerEmoji = (emoji) => {
  emit('onEmoji', emoji, currentSelectedIndex.value === 0 ? 'text' : 'link')
}
</script>
<style lang="less" scoped>
.emoji-box {
  width: 340px;
  height: 300px;
  background-color: rgba(var(--background-color), 0.6);
  backdrop-filter: blur(8px);
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 400px) {
    width: 80%;
    height: 260px;
  }

  .emoji-content {
    flex: 1;
    display: flex;
    gap: 2px;
    overflow-y: auto;
    flex-wrap: wrap;
    padding: 10px;
  }

  .emoji-type {
    padding: 10px;
    display: flex;
    background-color: rgba(var(--background-color), 0.7);
    gap: 2px;
  }
}
</style>
