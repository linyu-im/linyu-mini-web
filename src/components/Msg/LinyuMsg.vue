<template>
  <div class="msg-box" :class="{right:right}">
    <template v-if="msg.type==='recall'">
      <recall-msg :msg="msg"/>
    </template>
    <template v-else>
      <template v-if="!right">
        <linyu-avatar :text="props.msg.fromInfo?.name" size="40px"
                      class="mr-[5px]"/>
        <div class="msg-box-info">
          <div class="flex items-center">
            <div class="msg-username">
              {{ props.msg.fromInfo?.name }}
            </div>
            <div class="mgs-ip ml-[2px]">[{{ props.msg.fromInfo.ipOwnership ?? "未知" }}]</div>
          </div>
          <linyu-msg-content :right="right" :msg="props.msg"/>
        </div>
      </template>
      <template v-else>
        <div class="msg-box-info">
          <div class="flex items-center">
            <div class="mgs-ip mr-[2px]">[{{ props.msg.fromInfo.ipOwnership ?? "未知" }}]</div>
            <div class="msg-username">
              {{ props.msg.fromInfo.name }}
            </div>
          </div>
          <linyu-msg-content :right="right" :msg="props.msg"/>
        </div>
        <linyu-avatar v-if="right" :text="props.msg.fromInfo.name" size="40px"
                      class="ml-[5px]"/>
      </template>
    </template>
  </div>
</template>
<script setup>

import LinyuMsgContent from "@/components/Msg/LinyuMsgContent.vue";
import LinyuAvatar from "@/components/LinyuAvatar.vue";
import RecallMsg from "@/components/Msg/MsgContent/RecallMsg.vue";

const currentUserId = localStorage.getItem('userId')

const props = defineProps({
  msg: Object
})

const right = props.msg.fromId === currentUserId

</script>
<style lang="less" scoped>
.msg-box {
  display: flex;
  margin-bottom: 15px;
  width: 100%;

  .msg-box-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .msg-username {
      color: rgba(var(--text-color), 0.7);
      margin-bottom: 2px;
      user-select: none;
      font-size: 14px;
      font-weight: 600;
    }

    .mgs-ip {
      color: rgba(var(--text-color), 0.6);
      margin-bottom: 2px;
      user-select: none;
      font-size: 12px;
      font-weight: 600;
    }
  }

  &.right {
    justify-content: flex-end;

    .msg-box-info {
      align-items: flex-end;
    }
  }

}
</style>