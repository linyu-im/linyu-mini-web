<template>
  <linyu-draggable-window :width="320" :height="80" :rounded="20" :resize="true">
    <div class="video-answer">
      <div class="flex items-center">
        <linyu-avatar :info="{name:'heath'}" class="mr-[10px]"/>
        <div class="answer-content">
          <div class="answer-content-name">Heath</div>
          <div class="answer-content-label flex items-center">邀请你语音通话<loading-dots/></div>
        </div>
      </div>
      <div class="video-answer-operation">
        <div class="answer-operation bg-[rgb(var(--primary-color))]"
             style="box-shadow: 0 0 15px rgba(var(--primary-color));">
          <i class="iconfont icon-jieting" style="font-size: 24px"/>
        </div>
        <div class="answer-operation bg-[#FF4C4C]"
             style="box-shadow: 0 0 15px #FF4C4C;">
          <i class="iconfont icon-guaduan" style="font-size: 24px"/>
        </div>
      </div>
    </div>
  </linyu-draggable-window>
</template>
<script setup>

import LinyuDraggableWindow from "@/components/LinyuDraggableWindow.vue";
import LinyuAvatar from "@/components/LinyuAvatar.vue";
import LoadingDots from "@/components/LoadingDots.vue";
</script>
<style>
.video-answer {
  height: 100%;
  width: 100%;
  background-color: rgba(48, 48, 75, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  .answer-content {
    .answer-content-name {
      color: #FFFFFF;
      font-weight: 600;
    }

    .answer-content-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
  }

  .video-answer-operation {
    display: flex;
    gap: 15px;

    .answer-operation {
      width: 32px;
      height: 32px;
      border-radius: 40px;
      cursor: pointer;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>