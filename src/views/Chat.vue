<template>
  <div class="chat-container">
    <div class="chat-bg">
      <div class="chat-box">
        <!-- 左侧菜单 -->
        <div class="box-left" :class="{'show-left': showLeft}">
          <div class="chat-list-title">
            消息列表
            <div class="close-btn" @click="showLeft = false">×</div>
          </div>
          <div class="chat-list-item black">
            <div class="chat-item-avatar"></div>
            <linyu-avatar text="群" size="40px" :color="2" class="mr-[10px]"/>
            <div class="chat-item-content">
              <div class="flex items-center mb-[5px]">
                <div class="chat-content-name">linyu在线聊天群</div>
                <linyu-dot-hint text="99"/>
              </div>
              <div class="chat-content-msg">这是一条消息</div>
            </div>
          </div>
          <div class="text-[rgba(var(--text-color),0.7)] font-[600] mb-[5px]">私聊</div>
          <div class="chat-list-content">
            <div class="chat-list-item blue">
              <div class="chat-item-avatar"></div>
              <div class="chat-item-content">
                <div class="chat-content-name">linyu聊天群</div>
                <div class="chat-content-msg">这是一条消息</div>
              </div>
            </div>
            <div class="chat-list-item white">
              <div class="chat-item-avatar"></div>
              <div class="chat-item-content">
                <div class="chat-content-name">linyu聊天群</div>
                <div class="chat-content-msg">这是一条消息</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 遮罩层 -->
        <div class="mask" v-if="showLeft || showRight" @click="closeMask"></div>
        <!-- 中间部分 -->
        <div class="box-middle">
          <div class="middle-top">
            <div class="menu-btn" @click="showLeft = true">
              <i class="iconfont icon-liebiao text-[24px]"/>
            </div>
            linyu在线聊天群
            <div class="menu-btn" @click="showRight = true">
              <i class="iconfont icon-shezhi text-[24px]"/>
            </div>
          </div>
          <div class="middle-content">
            <div class="chat-show-area" ref="chatShowAreaRef">

              <div v-for="(item) in msgRecord" class="msg-item" :key="item.id"
                   :class="{right:item.fromId===currentUserId}">
                <linyu-avatar v-if="item.fromId!==currentUserId" :text="item.fromInfo.name" size="40px"
                              class="mr-[5px]"/>
                <div class="msg-box">
                  <div class="msg-username">
                    {{ item.fromInfo.name }}
                  </div>
                  <div class="msg-content">
                    {{ item.message }}
                  </div>
                </div>
                <linyu-avatar v-if="item.fromId===currentUserId" :text="item.fromInfo.name" size="40px"
                              class="ml-[5px]"/>
              </div>

            </div>

            <div class="chat-input-area">
              <linyu-input v-model:value="msgContent" width="80%" radius="50px"/>
              <div class="publish-button" @click="onSendMsg">
                <i class="iconfont icon-fasong2 text-[28px]"/>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧菜单 -->
        <div class="box-right" :class="{'show-right': showRight}">
          <div class="right-top">
            <div class="flex items-center">
              <div class="user-avatar"></div>
              <div class="user-name">heath</div>
            </div>
            <div class="flex">
              <icon-button v-if="themeStore.theme==='light'" @click="(e)=>toggleDark(e,'dark')" icon="icon-taiyang"/>
              <icon-button v-if="themeStore.theme==='dark'" @click="(e)=>toggleDark(e,'light')" icon="icon-yueliang"/>
              <icon-button @click="handlerLogout" icon="icon-tuichu"/>
            </div>
          </div>
          <div class="right-content">
            <div class="flex justify-between items-center mb-[10px]">
              <div class="text-[rgb(var(--text-color))] text-[14px] font-[600]">在线人数（20）</div>
              <div class="w-[140px] h-[30px] bg-[#F9FBFF] rounded-[30px]"></div>
            </div>
            <div class="online-list">
              <div class="online-list-item">
                <linyu-avatar text="1" size="40px"/>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
              <div class="online-list-item odd">
                <linyu-avatar text="2" size="40px"/>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
              <div class="online-list-item">
                <linyu-avatar text="3" size="40px"/>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
              <div class="online-list-item">
                <linyu-avatar text="4" size="40px"/>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
              <div class="online-list-item">
                <linyu-avatar text="5" size="40px"/>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, watch} from 'vue'
import {useThemeStore} from "@/stores/useThemeStore.js";
import IconButton from "@/components/IconButton.vue";
import {toggleDark} from "@/utils/theme.js";
import LinyuInput from "@/components/LinyuInput.vue";
import {useRouter} from "vue-router";
import LinyuAvatar from "@/components/LinyuAvatar.vue";
import ChatListApi from "@/api/chatList.js";
import LinyuDotHint from "@/components/LinyuDotHint.vue";
import MessageApi from "@/api/message.js";

const themeStore = useThemeStore();
const router = useRouter();

let recordIndex = 0;
const currentUserId = localStorage.getItem('userId')
const showLeft = ref(false)
const showRight = ref(false)
const groupChat = reactive({unreadCount: 0, lastMessage: {message: ""}})
const msgRecord = ref([])
const targetId = ref("1")
const msgContent = ref('')
const chatShowAreaRef = ref();
const isLoading = ref(false);
const isComplete = ref(false);

const handleScroll = () => {
  if (chatShowAreaRef.value) {
    if (chatShowAreaRef.value.scrollTop === 0 && !isLoading.value) {
      onGetMsgRecord();
    }
  }
};

onMounted(() => {
  if (chatShowAreaRef.value) {
    chatShowAreaRef.value.addEventListener('scroll', handleScroll);
  }
  onGetGroupChat()
})


const scrollToBottom = () => {
  if (chatShowAreaRef.value) {
    nextTick(() => chatShowAreaRef.value.scrollTop = chatShowAreaRef.value.scrollHeight);
  }
};

//获取聊天记录
const onGetMsgRecord = () => {
  if (isLoading.value || isComplete.value) return;
  isLoading.value = true;

  const container = chatShowAreaRef.value;
  const scrollTopBeforeLoad = container ? container.scrollTop : 0;
  const scrollHeightBeforeLoad = container ? container.scrollHeight : 0;

  MessageApi.record({targetId: targetId.value, index: recordIndex, num: 20}).then(res => {
    if (res.code === 0) {
      const newMessages = res.data;
      if (newMessages.length > 0) {
        msgRecord.value = [...newMessages, ...msgRecord.value];
        recordIndex += newMessages.length;
        nextTick(() => {
          if (recordIndex === newMessages.length) {
            scrollToBottom();
          } else {
            requestAnimationFrame(() => {
              if (container) {
                const scrollHeightAfterLoad = container.scrollHeight;
                container.scrollTop = scrollTopBeforeLoad + (scrollHeightAfterLoad - scrollHeightBeforeLoad);
              }
            });
          }
        });
      } else {
        isComplete.value = true
      }
    }
  }).finally(() => {
    isLoading.value = false;
  });
}

watch(targetId,
    () => {
      onGetMsgRecord()
    },
    {immediate: true},
)

const closeMask = () => {
  showLeft.value = false
  showRight.value = false
}

//退出登录
const handlerLogout = () => {
  localStorage.removeItem("x-token")
  router.push('/login')
}

//获取群聊
const onGetGroupChat = () => {
  ChatListApi.group().then(res => {
    if (res.code === 0) {
      groupChat.unreadCount = res.data.unreadCount
      groupChat.lastMessage = JSON.parse(res.data.lastMessage ?? "{}")
    }
  })
}

//发送消息
const onSendMsg = () => {
  if (!msgContent.value) return
  MessageApi.send({
    targetId: targetId.value,
    source: targetId.value === '1' ? 'group' : 'user',
    msgContent: msgContent.value,
  }).then(res => {
    if (res.code === 0) {
      msgRecord.value.push(res.data)
      msgContent.value = ''
      scrollToBottom()
    }
  })
}

</script>


<style lang="less" scoped>
.chat-container {
  width: 100%;
  height: 100%;
  position: absolute;
  background: var(--screen-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;

  .chat-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-image: var(--scrren-grid-bg-color);
    background-size: 50px 50px;
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .chat-box {
    width: 80%;
    height: 90%;
    display: flex;
    position: relative;
    min-width: min-content;

    @media screen and (max-width: 900px) {
      width: 95%;
      height: 95%;
    }

    .box-left {
      width: 280px;
      min-width: 280px;
      background-color: rgba(var(--background-color), 0.5);
      backdrop-filter: blur(8px);
      margin-right: 5px;
      border-radius: 5px;
      border: rgba(var(--background-color), 0.5) 3px solid;
      display: flex;
      flex-direction: column;
      padding: 0 10px;

      @media screen and (max-width: 900px) {
        position: fixed;
        left: -280px;
        top: 0;
        bottom: 0;
        margin: 0;
        z-index: 11;
        transition: all 0.3s;
        background-color: rgba(var(--background-color), 0.9);

        &.show-left {
          left: 0;
        }
      }

      .chat-list-title {
        color: rgb(var(--text-color));
        height: 60px;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        user-select: none;
        @media screen and (max-width: 900px) {
          justify-content: space-between;
        }
      }


      .chat-list-item {
        height: 60px;
        margin-bottom: 5px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;

        .chat-item-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .chat-content-name {
            font-size: 14px;
            color: white;
          }

          .chat-content-msg {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
          }
        }

        &.blue {
          background-color: rgb(var(--primary-color));

          &:hover {
            background-color: rgba(var(--primary-color), 0.7);
          }
        }

        &.black {
          background-image: url("/group-bg.png");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }

        &.white {
          background-color: rgba(var(--background-color), 0.5);

          .chat-item-content {
            .chat-content-name {
              color: rgb(var(--text-color));
            }

            .chat-content-msg {
              color: rgba(var(--text-color), 0.6);
            }
          }

          &:hover {
            background-color: rgba(var(--background-color), 0.8);
          }
        }

      }

      .chat-list-content {
        flex: 1;
        overflow-y: scroll;
        padding-right: 5px;
        margin-right: -10px;
      }

    }

    .box-middle {
      min-width: 300px;
      flex: 1;
      margin-right: 5px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;


      @media screen and (max-width: 900px) {
        margin: 0;
      }


      .middle-top {
        height: 60px;
        min-height: 60px;
        background-color: rgba(var(--background-color), 0.5);
        backdrop-filter: blur(8px);
        margin-bottom: 5px;
        border-radius: 5px;
        border: rgba(var(--background-color), 0.5) 3px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 15px;
        font-size: 18px;
        font-weight: 600;
        user-select: none;
        color: rgb(var(--text-color));

        .menu-btn {
          cursor: pointer;
          font-size: 24px;
        }

        @media screen and (max-width: 900px) {
          justify-content: space-between;
        }

        @media screen and (min-width: 900px) {
          .menu-btn {
            display: none;
          }
        }
      }

      .middle-content {
        flex: 1;
        min-height: 300px;
        border-radius: 5px;
        background-image: linear-gradient(130deg, rgba(var(--background-color), 0.3), rgba(var(--background-color), 0.5));
        backdrop-filter: blur(10px);
        border: rgba(var(--background-color), 0.5) 3px solid;
        display: flex;
        flex-direction: column;

        .chat-show-area {
          flex: 1;
          padding: 10px;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;

          .msg-item {
            display: flex;
            margin-bottom: 15px;

            .msg-box {
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

              .msg-content {
                display: inline-block;
                word-break: break-word;
                max-width: 50%;
                background-color: white;
                padding: 8px;
                border-radius: 0 10px 10px 10px;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.5px;
              }
            }


            &.right {
              justify-content: flex-end;

              .msg-box {
                align-items: flex-end;

                .msg-content {
                  border-radius: 10px 0 10px 10px;
                  background-color: rgb(var(--primary-color));
                  color: white;
                }
              }
            }
          }
        }

        .chat-input-area {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;

          .publish-button {
            height: 55px;
            width: 55px;
            border-radius: 50px;
            background-color: rgb(var(--primary-color));
            border: rgba(var(--background-color), 0.5) 2px solid;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
      }
    }

    .box-right {
      width: 280px;
      min-width: 280px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;


      @media screen and (max-width: 900px) {

        position: fixed;
        right: -280px;
        top: 0;
        bottom: 0;
        margin: 0;
        z-index: 11;
        transition: all 0.3s;

        &.show-right {
          right: 0;
        }

        .right-top {
          background-color: rgba(var(--background-color), 0.9) !important;
        }

        .right-content {
          background-color: rgba(var(--background-color), 0.9) !important;
        }
      }

      .right-top {
        height: 60px;
        min-height: 60px;
        background-color: rgba(var(--background-color), 0.5);
        backdrop-filter: blur(8px);
        margin-bottom: 5px;
        border-radius: 5px;
        border: rgba(var(--background-color), 0.5) 3px solid;
        display: flex;
        align-items: center;
        padding: 5px;
        user-select: none;
        justify-content: space-between;

        .user-avatar {
          height: 40px;
          width: 40px;
          background-color: rgb(var(--primary-color));
          border-radius: 40px;
          margin-right: 5px;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: rgb(var(--text-color));
        }

        .user-operate {
          font-size: 14px;
          font-weight: 600;
          color: rgb(var(--primary-color));
          cursor: pointer;
        }
      }

      .right-content {
        flex: 1;
        min-height: 300px;
        background-color: rgba(var(--background-color), 0.5);
        backdrop-filter: blur(8px);
        border-radius: 5px;
        border: rgba(var(--background-color), 0.5) 3px solid;
        padding: 5px;

        .online-list {
          overflow-y: scroll;

          .online-list-item {
            height: 50px;
            border-radius: 5px;
            background-image: linear-gradient(to right, rgba(var(--minor-color), 0.4), rgba(var(--minor-color), 0));
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            padding: 10px;

            &.odd {
              background-image: linear-gradient(to left, rgba(var(--minor-color), 0.4), rgba(var(--minor-color), 0));
            }
          }
        }
      }
    }
  }

  .close-btn {
    cursor: pointer;
    font-size: 24px;
    padding: 0 10px;

    @media screen and (min-width: 900px) {
      display: none;
    }
  }
}
</style>
