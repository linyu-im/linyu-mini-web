<template>
  <div class="chat-list-msg-content">
    <div v-if="props.isGroup">{{ `${msg?.fromInfo?.name}&nbsp;:&nbsp;` }}</div>
    <div v-if="msg?.type === MessageType.Text">
      <text-msg :msg="props.msg" />
    </div>
    <div v-if="msg?.type === MessageType.Recall">撤回一条消息</div>
    <div v-if="msg?.type === MessageType.Emoji" class="flex items-center">
      <emoji-msg :src="msg?.message" height="18px" width="18px" padding="0" />
    </div>
    <div v-if="msg?.type === MessageType.Call" class="flex items-center">[音视频通话]</div>
  </div>
</template>
<script setup>
import EmojiMsg from '@/components/Msg/MsgContent/EmojiMsg.vue'
import { MessageType } from '@/constant/messageType.js'
import TextMsg from '@/components/Msg/MsgContent/TextMsg.vue'

const props = defineProps({
  msg: Object,
  isGroup: {
    type: Boolean,
    default: true,
  },
})
</script>
<style lang="less" scoped>
.chat-list-msg-content {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
