<template>
  <div class="msg" :class="{ right: props.right }">
    <div
      class="msg-content"
      :class="{ right: props.right }"
      @mouseenter="showMenu"
      @mouseleave="hideMenu"
    >
      <div v-if="props.msg.type === MessageType.Text">
        <text-msg :msg="props.msg" :right="right" />
      </div>
      <div v-if="props.msg.type === MessageType.Emoji">
        <emoji-msg :src="props.msg.message" />
      </div>
      <div v-if="props.msg.type === MessageType.Call">
        <call-msg :msg="props.msg" :right="right" />
      </div>
    </div>
    <!--消息相关操作-->
    <transition name="fade">
      <div
        v-if="isShowMenu"
        class="msg-menu mr-[5px] ml-[5px]"
        @mouseenter="showMenu"
        @mouseleave="hideMenu"
      >
        <linyu-tooltip content="引用">
          <linyu-icon-button
            @click="handlerSetReference"
            size="24px"
            font-size="16px"
            icon="icon-yinyong"
          />
        </linyu-tooltip>
        <linyu-tooltip v-if="right" content="撤回">
          <linyu-icon-button @click="onRecallMsg" size="24px" font-size="16px" icon="icon-chehui" />
        </linyu-tooltip>
        <linyu-tooltip @click="handlerCopy" content="复制">
          <linyu-icon-button size="24px" font-size="16px" icon="icon-fuzhi" />
        </linyu-tooltip>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LinyuIconButton from '@/components/LinyuIconButton.vue'
import LinyuTooltip from '@/components/LinyuTooltip.vue'
import MessageApi from '@/api/message.js'
import { useToast } from '@/components/ToastProvider.vue'
import { useChatMsgStore } from '@/stores/useChatMsgStore.js'
import EmojiMsg from '@/components/Msg/MsgContent/EmojiMsg.vue'
import { MessageType } from '@/constant/messageType.js'
import TextMsg from '@/components/Msg/MsgContent/TextMsg.vue'
import { TextContentType } from '@/constant/textContentType.js'
import CallMsg from '@/components/Msg/MsgContent/CallMsg.vue'

const showToast = useToast()
const msgStore = useChatMsgStore()

const props = defineProps({
  msg: Object,
  right: { type: Boolean, default: false },
})

const isShowMenu = ref(false)
let hideTimeout = null

const showMenu = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  isShowMenu.value = true
}

const hideMenu = () => {
  hideTimeout = setTimeout(() => {
    isShowMenu.value = false
    clearTimeout(hideTimeout)
    hideTimeout = null
  }, 200)
}

//撤回消息
const onRecallMsg = () => {
  MessageApi.recall({ msgId: props.msg.id }).then((res) => {
    if (res.code !== 0) {
      showToast(res.msg, true)
    }
  })
}

const handlerSetReference = () => {
  msgStore.setReferenceMsg(props.msg)
}

const handlerCopy = () => {
  let msg = ''
  if (props.msg.type === MessageType.Text) {
    try {
      const texts = JSON.parse(props.msg?.message)
      texts.map((item) => {
        if (item.type === TextContentType.At) {
          msg += '@' + JSON.parse(item.content).name
        } else {
          msg += item.content
        }
      })
    } catch {
      msg = props.msg?.message
    }
  }
  navigator.clipboard.writeText(msg)
}
</script>

<style lang="less" scoped>
.msg {
  position: relative;
  width: 100%;
  display: flex;

  .msg-content {
    display: inline-block;
    word-break: break-word;
    max-width: 70%;
    background-color: white;
    padding: 8px;
    border-radius: 0 10px 10px 10px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;

    &.right {
      border-radius: 10px 0 10px 10px;
      background-color: rgb(var(--primary-color));
      color: white;
    }
  }

  .msg-menu {
    padding: 0 10px;
    height: 30px;
    border-radius: 10px;
    background-color: rgba(var(--background-color), 0.5);
    user-select: none;
    border: rgba(255, 255, 255, 0.8) 2px solid;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
  }

  &.right {
    justify-content: end;
    flex-direction: row-reverse;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
