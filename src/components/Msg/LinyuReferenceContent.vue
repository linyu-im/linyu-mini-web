<template>
  <div v-if="props.msg.type === MessageType.Text" class="font-[600]">
    {{ props.msg.fromInfo?.name }} :
    <text-msg :msg="props.msg" />
  </div>
  <emoji-msg v-if="props.msg.type === MessageType.Emoji" :src="props.msg.message" />
  <call-msg v-if="props.msg.type === MessageType.Call" :msg="props.msg" />
</template>
<script setup>
import EmojiMsg from '@/components/Msg/MsgContent/EmojiMsg.vue'
import { MessageType } from '@/constant/messageType.js'
import TextMsg from '@/components/Msg/MsgContent/TextMsg.vue'
import CallMsg from '@/components/Msg/MsgContent/CallMsg.vue'

const props = defineProps({
  msg: Object,
})
</script>
<style></style>
