<template>
  <template v-if="visible">
    <!--  语音接听-->
    <linyu-draggable-window v-if="!isReady" :rounded="20" :resize="false">
      <div class="video-answer">
        <div class="flex items-center">
          <linyu-avatar :info="props.targetInfo" class="mr-[10px]" />
          <div class="answer-content">
            <div class="answer-content-name">{{ props.targetInfo.name }}</div>
            <div class="answer-content-label flex items-center">
              {{
                props.isSend
                  ? '正在等待对方接听'
                  : `邀请你${props.isOnlyAudio ? '语音' : '视频'}通话`
              }}
              <loading-dots />
            </div>
          </div>
        </div>
        <div class="flex gap-[15px]">
          <div
            v-if="!props.isSend"
            class="operation-button bg-[rgb(var(--primary-color))]"
            @click="onAccept"
            style="box-shadow: 0 0 15px rgba(var(--primary-color))"
          >
            <i class="iconfont icon-jieting" style="font-size: 24px" />
          </div>
          <div
            class="operation-button bg-[#FF4C4C]"
            style="box-shadow: 0 0 15px #ff4c4c"
            @click="onHangup"
          >
            <i class="iconfont icon-guaduan" style="font-size: 24px" />
          </div>
        </div>
      </div>
    </linyu-draggable-window>
    <!--  语音通话-->
    <linyu-draggable-window
      v-if="isReady && props.isOnlyAudio"
      :rounded="20"
      :resize="false"
      :refresh="reducedSize"
    >
      <div class="audio-call" :class="{ reduced: isReduced }">
        <div class="audio-call-info">
          <linyu-avatar :info="props.targetInfo" class="info-avatar" @click="isReduced = false" />
          <div class="info-content">
            <template v-if="!isReduced">
              <div class="content-name">{{ props.targetInfo.name }}</div>
              <div class="content-time flex items-center">
                {{ formatTimingTime(time) }}
              </div>
            </template>
            <div v-else class="content-time">
              {{ formatTimingTime(time) }}
            </div>
          </div>
        </div>
        <div v-if="!isReduced" class="flex gap-[15px]">
          <div
            class="operation-button bg-[#FFF]"
            style="box-shadow: 0 0 15px #fff"
            @click="isAudioEnabled = !isAudioEnabled"
          >
            <i
              :class="`iconfont icon-${!isAudioEnabled ? 'maikefengguan' : 'maikefengkai'}`"
              style="font-size: 18px; color: #6c6c6c"
            />
          </div>
          <div
            class="operation-button bg-[#FF4C4C]"
            style="box-shadow: 0 0 15px #ff4c4c"
            @click="onHangup"
          >
            <i class="iconfont icon-guaduan" style="font-size: 24px" />
          </div>
          <div
            class="operation-button bg-[#FFF]"
            style="box-shadow: 0 0 15px #fff"
            @click="isReduced = true"
          >
            <i class="iconfont icon-shousuo" style="font-size: 24px; color: #6c6c6c" />
          </div>
        </div>
        <video ref="local" autoPlay class="hidden" />
        <video ref="remote" autoPlay class="hidden" />
      </div>
    </linyu-draggable-window>
    <!--  视频通话-->
    <linyu-draggable-window v-if="isReady && !props.isOnlyAudio" :rounded="20" :resize="false">
      <div class="video-call">
        <video
          ref="local"
          autoPlay
          :class="`${isVideoSwitch ? 'max-window' : 'min-window'}`"
          @click="isVideoSwitch = !isVideoSwitch"
        />
        <video
          ref="remote"
          autoPlay
          :class="`${isVideoSwitch ? 'min-window' : 'max-window'}`"
          @click="isVideoSwitch = !isVideoSwitch"
        />
        <div class="video-call-operation">
          <div class="text-white mb-[2px]">
            {{ formatTimingTime(time) }}
          </div>
          <div class="flex gap-[10px]">
            <div
              class="operation-button bg-[#FFF]"
              style="box-shadow: 0 0 15px #fff"
              @click="isAudioEnabled = !isAudioEnabled"
            >
              <i
                :class="`iconfont icon-${!isAudioEnabled ? 'maikefengguan' : 'maikefengkai'}`"
                style="font-size: 18px; color: #6c6c6c"
              />
            </div>
            <div
              class="operation-button bg-[#FF4C4C]"
              style="box-shadow: 0 0 15px #ff4c4c"
              @click="onHangup"
            >
              <i class="iconfont icon-guaduan" style="font-size: 24px" />
            </div>
            <div
              class="operation-button bg-[#FFF]"
              style="box-shadow: 0 0 15px #fff"
              @click="isVideoEnabled = !isVideoEnabled"
            >
              <i
                :class="`iconfont icon-${!isVideoEnabled ? 'shexiangtou_guanbi' : 'shexiangtou'}`"
                style="font-size: 18px; color: #6c6c6c"
              />
            </div>
          </div>
        </div>
      </div>
    </linyu-draggable-window>
  </template>
</template>
<script setup>
import LinyuDraggableWindow from '@/components/LinyuDraggableWindow.vue'
import LinyuAvatar from '@/components/LinyuAvatar.vue'
import LoadingDots from '@/components/LoadingDots.vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from '@/components/ToastProvider.vue'
import EventBus from '@/utils/eventBus.js'
import VideoApi from '@/api/video.js'
import MessageApi from '@/api/message.js'
import { MessageSource } from '@/constant/messageSource.js'
import { MessageType } from '@/constant/messageType.js'
import { formatTimingTime } from '@/utils/date.js'

const props = defineProps({ targetInfo: Object, isSend: Boolean, isOnlyAudio: Boolean })

const visible = defineModel('visible')
const showToast = useToast()

const isReady = ref(false)
const isReduced = ref(false)
const pc = ref()
const timerId = ref()
const local = ref()
const remote = ref()
const time = ref(0)
const webcamStream = ref()
const isVideoSwitch = ref(false)
const isAudioEnabled = ref(true)
const isVideoEnabled = ref(true)

const reducedSize = computed(() => {
  if (isReduced.value) {
    return { width: 90 }
  } else {
    return { width: 320 }
  }
})

const handlerVideoMsg = (msg) => {
  switch (msg.type) {
    case 'offer': {
      handleVideoOfferMsg(msg)
      break
    }
    case 'answer': {
      handleVideoAnswerMsg(msg)
      break
    }
    case 'candidate': {
      handleNewICECandidateMsg(msg)
      break
    }
    case 'hangup': {
      handlerDestroyTime()
      showToast('对方已挂断~', true)
      setTimeout(async function () {
        visible.value = false
      }, 2000)
      break
    }
    case 'accept': {
      onOffer()
      break
    }
  }
}

watch(visible, () => {
  if (!visible.value) {
    isReady.value = false
    isReduced.value = false
    if (webcamStream.value) {
      webcamStream.value.getTracks().forEach((track) => track.stop())
      webcamStream.value = null
    }
    pc.value = null
    time.value = 0
  }
})

watch(isVideoEnabled, () => {
  if (webcamStream.value) {
    webcamStream.value.getVideoTracks().forEach((track) => {
      track.enabled = isVideoEnabled.value
    })
  }
})

watch(isAudioEnabled, () => {
  if (webcamStream.value) {
    webcamStream.value.getAudioTracks().forEach((track) => {
      track.enabled = isAudioEnabled.value
    })
  }
})

const initRTCPeerConnection = () => {
  const iceServer = {
    iceServers: [
      {
        url: 'stun:stun.l.google.com:19302',
      },
      {
        url: 'turn:numb.viagenie.ca',
        username: 'webrtc@live.com',
        credential: 'muazkh',
      },
    ],
  }
  pc.value = new RTCPeerConnection(iceServer)
  pc.value.onicecandidate = handleICECandidateEvent
  pc.value.oniceconnectionstatechange = handleICEConnectionStateChangeEvent
  pc.value.ontrack = handleTrackEvent
}

const videoCall = async () => {
  try {
    webcamStream.value = await navigator.mediaDevices.getUserMedia({
      video: !props.isOnlyAudio,
      audio: true,
    })
    local.value.srcObject = webcamStream.value
    local.value.muted = true
    webcamStream.value.getTracks().forEach((track) => pc.value.addTrack(track, webcamStream.value))
  } catch {
    showToast('相机/麦克风权限未允许~', true)
  }
}

onMounted(async () => {
  EventBus.on('on-receive-video', handlerVideoMsg)
})

onUnmounted(async () => {
  EventBus.off('on-receive-video', handlerVideoMsg)
})

const handleVideoOfferMsg = async (data) => {
  const desc = new RTCSessionDescription(data.desc)
  await pc.value.setRemoteDescription(desc)
  await pc.value.setLocalDescription(await pc.value.createAnswer())
  await VideoApi.answer({ userId: props.targetInfo.id, desc: pc.value.localDescription })
}

const handleICECandidateEvent = (event) => {
  if (event.candidate) {
    VideoApi.candidate({ userId: props.targetInfo.id, candidate: event.candidate })
  }
}

const handleTrackEvent = (event) => {
  remote.value.srcObject = event.streams[0]
}

const handleVideoAnswerMsg = async (data) => {
  const desc = new RTCSessionDescription(data.desc)
  await pc.value.setRemoteDescription(desc).catch(reportError)
}

const handleNewICECandidateMsg = async (data) => {
  const candidate = new RTCIceCandidate(data.candidate)
  try {
    await pc.value.addIceCandidate(candidate)
  } catch (err) {
    console.log(err)
  }
}

const onAccept = async () => {
  isReady.value = true
  await nextTick(async () => {
    initRTCPeerConnection()
    await videoCall()
  })
  VideoApi.accept({ userId: props.targetInfo.id }).then(() => {
    isReady.value = true
  })
}

const handlerDestroyTime = () => {
  if (timerId.value) clearInterval(timerId.value)
}

const handleICEConnectionStateChangeEvent = () => {
  if (pc.value?.iceConnectionState === 'disconnected') {
    showToast('对方通话异常~', true)
    onHangup()
  } else {
    handlerDestroyTime()
    timerId.value = setInterval(() => {
      time.value = time.value + 1
    }, 1000)
  }
}

const onOffer = async () => {
  isReady.value = true
  await nextTick(async () => {
    initRTCPeerConnection()
    await videoCall()
    const offer = await pc.value.createOffer()
    await pc.value.setLocalDescription(offer)
    await VideoApi.offer({ userId: props.targetInfo.id, desc: pc.value.localDescription })
  })
}

const onHangup = () => {
  handlerDestroyTime()
  VideoApi.hangup({ userId: props.targetInfo.id }).then(() => {
    visible.value = false
  })
  MessageApi.send({
    targetId: props.targetInfo.id,
    source: MessageSource.User,
    msgContent: time.value,
    type: MessageType.Call,
  })
}
</script>
<style lang="less" scoped>
.video-answer {
  width: 320px;
  background-color: rgba(48, 48, 75, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;

  .answer-content {
    .answer-content-name {
      color: #ffffff;
      font-weight: 600;
    }

    .answer-content-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
  }
}

.audio-call {
  background-color: rgba(48, 48, 75, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  width: 320px;

  &.reduced {
    width: 90px;
    justify-content: center;

    .audio-call-info {
      flex-direction: column;
      justify-content: center;

      .info-avatar {
        margin-right: 0;
        margin-bottom: 5px;
      }
    }
  }

  .audio-call-info {
    display: flex;
    align-items: center;

    .info-avatar {
      margin-right: 10px;
    }

    .info-content {
      display: flex;
      flex-direction: column;

      .content-name {
        color: #ffffff;
        font-weight: 600;
      }

      .content-time {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
      }
    }
  }
}

.video-call {
  width: 200px;
  background-color: rgba(48, 48, 75, 0.9);
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px 5px;
  border-radius: 5px;

  .video-call-operation {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .max-window {
    width: 100%;
    border-radius: 10px;
    transform: scaleX(-1);
  }

  .min-window {
    position: absolute;
    width: 30%;
    border-radius: 5px;
    top: 5px;
    right: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
    transform: scaleX(-1);
    cursor: pointer;
    background-color: #fff;
  }
}

.operation-button {
  width: 32px;
  height: 32px;
  border-radius: 40px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
