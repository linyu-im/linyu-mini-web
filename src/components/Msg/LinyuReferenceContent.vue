<template>
  <div v-if="msg.type===MessageType.Text" class="font-[600]">
    {{ msg.fromInfo?.name }} : {{ msg.message }}
  </div>
  <emoji-msg v-if="msg.type===MessageType.Emoji" :src="msg.message"/>
</template>
<script setup>

import EmojiMsg from "@/components/Msg/MsgContent/EmojiMsg.vue";
import {MessageType} from "@/constant/messageType.js";

const props = defineProps({
  msg: Object
})

</script>
<style>

</style>