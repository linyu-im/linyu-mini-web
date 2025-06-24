<template>
  <linyu-modal :is-open="isOpen">
    <div class="notify" @click.stop>
      <div class="notify-content">
        <div class="content-title">{{ notify?.notifyTitle }}</div>
        <div class="content-text" v-html="notify?.notifyContent" />
        <div class="mt-[20px] flex justify-end">
          <border-gradient-button @click="handlerClose" class="w-[140px]">
            我知道了
          </border-gradient-button>
        </div>
      </div>
      <div class="decorative-area">
        <div
          class="circular w-[100px] h-[100px] bg-[rgba(var(--primary-color))] z-1 transform translate-x-1/3"
        />
        <div class="circular minor w-[80px] h-[80px] bg-[rgba(var(--primary-color))] z-30" />
        <div
          class="circular w-[60px] h-[60px] bg-[rgba(var(--primary-color))] z-1 transform -translate-x-1/3"
        />
      </div>
    </div>
  </linyu-modal>
</template>

<script setup>
import LinyuModal from '@/components/LinyuModal.vue'
import BorderGradientButton from '@/components/BorderGradientButton.vue'
import { onMounted, ref } from 'vue'
import NotifyApi from '@/api/notify.js'

const isOpen = defineModel('isOpen')
const notify = ref()

const handlerClose = () => {
  localStorage.setItem('lastCloseTime', Date.now().toString())
  isOpen.value = false
}

onMounted(() => {
  handlerIsNotify()
})

const isShowNotify = () => {
  const storedTime = localStorage.getItem('lastCloseTime')
  if (!storedTime) {
    return true
  }
  const storedTimestamp = parseInt(storedTime, 10)
  const currentTimestamp = Date.now()
  const timeDiff = currentTimestamp - storedTimestamp
  return timeDiff > 24 * 60 * 60 * 1000
}

//是否弹出通知窗口
const handlerIsNotify = () => {
  if (isShowNotify()) {
    NotifyApi.getLatestNotify().then((res) => {
      if (res.code === 0 && res.data) {
        console.log(res)
        notify.value = res.data
        isOpen.value = true
      }
    })
  }
}
</script>

<style lang="less" scoped>
.notify {
  position: relative;
  z-index: 0;
  width: 600px;
  border-radius: 10px;
  max-width: 90%;

  .notify-content {
    max-height: 350px;
    width: 100%;
    position: relative;
    z-index: 20;
    border-radius: 10px;
    background-image: linear-gradient(
      130deg,
      rgba(var(--background-color), 0.7),
      rgba(var(--background-color), 0.9)
    );
    backdrop-filter: blur(10px);
    border: rgba(var(--background-color), 0.5) 3px solid;
    display: flex;
    flex-direction: column;
    padding: 50px 70px;
    overflow: hidden;
    color: rgb(var(--text-color));

    @media screen and (max-width: 900px) {
      padding: 50px 50px;
    }

    .content-title {
      font-size: 22px;
      font-weight: 700;
    }

    .content-text {
      margin-top: 20px;
      font-weight: 500;
      font-size: 16px;
      display: flex;
      gap: 10px;
      flex-direction: column;
      overflow-x: scroll;

      :deep(span) {
        font-weight: 600;
        background: linear-gradient(
          to right,
          rgb(var(--primary-color)),
          rgba(var(--primary-color), 0.7)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: pointer;
      }
    }
  }

  .decorative-area {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: -41px;
  }

  .circular {
    border-radius: 100%;
    border: rgba(255, 255, 255, 0.9) 2px solid;
    background-color: rgba(var(--primary-color), 0.8);
    backdrop-filter: blur(8px);

    &.minor {
      background-color: rgba(160, 217, 246, 0.5);
      backdrop-filter: blur(5px);
    }
  }
}
</style>
