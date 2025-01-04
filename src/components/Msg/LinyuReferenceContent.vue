<template>
  <div v-if="msg.type===MessageType.Text" class="font-[600]">
    {{ msg.fromInfo?.name }} : <text-msg :msg="msg"/>
  </div>
  <emoji-msg v-if="msg.type===MessageType.Emoji" :src="msg.message"/>
</template>
<script setup>

import EmojiMsg from "@/components/Msg/MsgContent/EmojiMsg.vue";
import {MessageType} from "@/constant/messageType.js";
import TextMsg from "@/components/Msg/MsgContent/TextMsg.vue";

const props = defineProps({
  msg: Object
})

</script>
<style>

</style>