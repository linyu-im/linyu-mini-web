<template>
  <template v-if="visible">
    <linyu-draggable-window v-if="!isReady" :rounded="20" :resize="false">
      <div class="file-answer">
        <div class="answer-content-wrapper">
          <linyu-avatar :info="props.targetInfo" class="mr-[10px]" />
          <div class="answer-content">
            <div class="flex">
              <div class="answer-content-name">{{ props.targetInfo.name }}</div>
              <div class="answer-content-label flex items-center">
                {{ props.isSend ? '等待对方接收' : `请求发送文件` }}
                <loading-dots />
              </div>
            </div>
            <div class="flex text-[10px]">
              <div class="answer-content-label mr-[5px]" style="font-size: 12px">
                {{ formatSize(props.file.size) }}
              </div>
              <div class="answer-content-label ellipsis" style="font-size: 12px">
                {{ props.file.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="answer-operation">
          <div
            v-if="!props.isSend"
            class="operation-button bg-[rgb(var(--primary-color))]"
            style="box-shadow: 0 0 15px rgba(var(--primary-color))"
            @click="onAccept"
          >
            <i class="iconfont icon-yunxu" style="font-size: 20px" />
          </div>
          <div
            class="operation-button bg-[#FFF]"
            style="box-shadow: 0 0 15px #fff"
            @click="onCancel"
          >
            <i class="iconfont icon-quxiao" style="font-size: 18px; color: #6c6c6c" />
          </div>
        </div>
      </div>
    </linyu-draggable-window>
    <linyu-draggable-window v-if="isReady" :rounded="10" :resize="false">
      <div class="file-receive">
        <linyu-circle-progress :progress="progress" :size="60" :strokeWidth="6" />
        <div class="file-receive-label flex items-center">
          {{ progress >= 100 ? '传输完成' : '传输中' }}
          <loading-dots v-if="progress < 100" />
        </div>
        <div class="flex gap-[5px]">
          <div
            v-if="!isSend && progress >= 100"
            class="operation-button bg-[#FFF]"
            style="box-shadow: 0 0 15px #fff"
            @click="onDownload"
          >
            <i class="iconfont icon-xiazai" style="font-size: 20px; color: #6c6c6c" />
          </div>
          <div
            class="operation-button bg-[#FFF]"
            style="box-shadow: 0 0 15px #fff"
            @click="onCancel"
          >
            <i class="iconfont icon-quxiao" style="font-size: 18px; color: #6c6c6c" />
          </div>
        </div>
      </div>
    </linyu-draggable-window>
  </template>
</template>

<script setup>
import FileApi from '@/api/file.js'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import EventBus from '@/utils/eventBus.js'
import LinyuDraggableWindow from '@/components/LinyuDraggableWindow.vue'
import LinyuAvatar from '@/components/LinyuAvatar.vue'
import LoadingDots from '@/components/LoadingDots.vue'
import LinyuCircleProgress from '@/components/LinyuCircleProgress.vue'
import { formatSize } from '../utils/common.js'
import { useToast } from '@/components/ToastProvider.vue'

const props = defineProps({ targetInfo: Object, isSend: Boolean, file: Object })

const visible = defineModel('visible')
const showToast = useToast()

const pc = ref()
const dataChannel = ref(null)
const isReady = ref(false)
const progress = ref(0)
const receivedChunks = ref([])
const receivedSize = ref(0)

const handlerFileMsg = (msg) => {
  switch (msg.type) {
    case 'offer': {
      handleFileOfferMsg(msg)
      break
    }
    case 'answer': {
      handleFileAnswerMsg(msg)
      break
    }
    case 'candidate': {
      handleNewICECandidateMsg(msg)
      break
    }
    case 'cancel': {
      showToast('对方已取消~', true)
      visible.value = false
      break
    }
    case 'accept': {
      onOffer()
      break
    }
  }
}

onMounted(async () => {
  EventBus.on('on-receive-file', handlerFileMsg)
})

onUnmounted(async () => {
  EventBus.off('on-receive-file', handlerFileMsg)
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
  // 设置 DataChannel 监听
  if (props.isSend) {
    dataChannel.value = pc.value.createDataChannel('fileTransfer')
    setupDataChannel()
  } else {
    pc.value.ondatachannel = (event) => {
      dataChannel.value = event.channel
      setupDataChannel()
    }
  }
  pc.value.onicecandidate = handleICECandidateEvent
  pc.value.oniceconnectionstatechange = handleICEConnectionStateChangeEvent
}

const setupDataChannel = () => {
  dataChannel.value.onopen = () => {
    if (props.isSend && props.file) {
      //发送文件
      sendFile(props.file)
    }
  }
  dataChannel.value.onclose = () => console.log('DataChannel closed')
  dataChannel.value.onmessage = handleDataChannelMessage
}

const handleICECandidateEvent = (event) => {
  if (event.candidate) {
    FileApi.candidate({ userId: props.targetInfo.id, candidate: event.candidate })
  }
}

const handleICEConnectionStateChangeEvent = () => {
  // if (pc.value?.iceConnectionState === "disconnected") {}
}

watch(visible, () => {
  if (!visible.value) {
    isReady.value = false
    if (dataChannel.value) dataChannel.value.close()
    pc.value = null
    progress.value = 0
    receivedChunks.value = []
  }
})

const handleFileOfferMsg = async (data) => {
  const desc = new RTCSessionDescription(data.desc)
  await pc.value.setRemoteDescription(desc)
  await pc.value.setLocalDescription(await pc.value.createAnswer())
  await FileApi.answer({ userId: props.targetInfo.id, desc: pc.value.localDescription })
}

const handleFileAnswerMsg = async (data) => {
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
  })
  FileApi.accept({ userId: props.targetInfo.id })
}

const onCancel = () => {
  visible.value = false
  if (progress.value < 100) {
    FileApi.cancel({ userId: props.targetInfo.id })
  }
}

const onOffer = async () => {
  isReady.value = true
  await nextTick(async () => {
    initRTCPeerConnection()
    const offer = await pc.value.createOffer()
    await pc.value.setLocalDescription(offer)
    await FileApi.offer({ userId: props.targetInfo.id, desc: pc.value.localDescription })
  })
}

const handleDataChannelMessage = (e) => {
  const message = e.data
  if (typeof message === 'object') {
    if (!receivedChunks.value) {
      console.error('No active file transfer, ignoring binary message.')
      return
    }
    if (message instanceof ArrayBuffer || message instanceof Uint8Array) {
      receivedChunks.value.push(message instanceof ArrayBuffer ? message : message.buffer)
      receivedSize.value += message.byteLength
      progress.value = Math.floor((receivedSize.value / props.file.size) * 100)
      if (props.file.size === receivedSize.value) {
        try {
          //下载
          onDownload()
        } catch (error) {
          console.error('Error finalizing file transfer', error)
        } finally {
          receivedSize.value = 0
        }
      }
    } else {
      console.error('Unknown binary message type', message)
    }
  }
}

const onDownload = () => {
  if (receivedChunks.value && receivedChunks.value.length > 0) {
    const blob = new Blob(receivedChunks.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.file.name
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }
}

const sendFile = (file) => {
  return new Promise((resolve, reject) => {
    const chunkSize = 16 * 1024
    const totalChunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    let totalSent = 0
    let lastProgressUpdate = Date.now()
    const fileReader = new FileReader()
    const sendNextChunk = () => {
      try {
        const start = currentChunk * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)
        fileReader.readAsArrayBuffer(chunk)
      } catch (e) {
        reject(e)
      }
    }
    fileReader.onload = async () => {
      if (dataChannel.value && dataChannel.value.readyState === 'open') {
        try {
          dataChannel.value.send(fileReader.result)
          totalSent += fileReader.result.byteLength
          const now = Date.now()
          if (now - lastProgressUpdate > 100) {
            progress.value = Math.floor((totalSent / file.size) * 100)
            lastProgressUpdate = now
          }
          currentChunk++
          if (currentChunk < totalChunks) {
            setTimeout(() => sendNextChunk(), 0)
          } else {
            progress.value = (totalSent / file.size) * 100
            resolve()
          }
        } catch (e) {
          reject(e)
        }
      }
    }
    sendNextChunk()
  })
}
</script>

<style lang="less" scoped>
.file-answer {
  width: 320px;
  background-color: rgba(48, 48, 75, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;

  .answer-content-wrapper {
    display: flex;
    align-items: center;
    flex: 1;

    .answer-content {
      .answer-content-name {
        color: #ffffff;
        font-weight: 600;
        margin-right: 5px;
      }

      .answer-content-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;

        &.ellipsis {
          width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-word;
        }
      }
    }
  }

  .answer-operation {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}

.file-receive {
  width: 90px;
  background-color: rgba(48, 48, 75, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  justify-content: center;

  .file-receive-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin: 5px 0;
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
