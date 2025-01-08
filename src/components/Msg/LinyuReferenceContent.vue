<template>
  <div v-if="msg.type===MessageType.Text" class="font-[600]">
    {{ msg.fromInfo?.name }} :
    <text-msg :msg="msg"/>
  </div>
  <emoji-msg v-if="msg.type===MessageType.Emoji" :src="msg.message"/>
  <call-msg v-if="msg.type===MessageType.Call" :msg="msg"/>
</template>
<script setup>

import EmojiMsg from "@/components/Msg/MsgContent/EmojiMsg.vue";
import {MessageType} from "@/constant/messageType.js";
import TextMsg from "@/components/Msg/MsgContent/TextMsg.vue";
import CallMsg from "@/components/Msg/MsgContent/CallMsg.vue";

const props = defineProps({
  msg: Object
})

</script>
<style>

</style>