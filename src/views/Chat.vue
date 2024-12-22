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
          <div
              class="chat-list-item black"
              @click="()=>{targetId='1';closeMask()}"
          >
            <div class="chat-item-avatar"></div>
            <linyu-avatar text="群" size="40px" :color="2" class="mr-[10px]"/>
            <div class="chat-item-content">
              <div class="flex items-center mb-[5px]">
                <div class="chat-content-name">{{ groupChat?.targetInfo?.name }}</div>
                <linyu-dot-hint text="99"/>
              </div>
              <div v-if="groupChat?.lastMessage" class="chat-content-msg">
                {{ groupChat?.lastMessage?.fromInfo?.name }}
                :
                {{ groupChat?.lastMessage?.message }}
              </div>
            </div>
          </div>
          <div v-if="privateChatList?.length>0"
               class="text-[rgba(var(--text-color),0.7)] font-[600] mb-[5px]"
          >
            私聊
          </div>
          <div class="chat-list-content">
            <div v-for="item in privateChatList"
                 :key="item.id"
                 :class="['chat-list-item', targetId === item.targetId ? 'blue' : 'white']"
                 @click="()=>{targetId=item.targetId;currentSelectTarget=item;closeMask()}"
            >
              <linyu-avatar :text="item.targetInfo.name" size="40px" class="mr-[10px]"/>
              <div class="chat-item-content">
                <div class="flex items-center mb-[5px]">
                  <div class="chat-content-name">{{ item.targetInfo.name }}</div>
                  <linyu-dot-hint text="99"/>
                </div>
                <div class="chat-content-msg">{{ item.lastMessage?.message }}</div>
              </div>
            </div>
          </div>
          <div class="mb-[10px]">
            <linyu-card-carousel
                :play="true"
                :images="[{key:'github',img:'/github-bg.png'},
                {key:'bili',img:'/bili-bg.png'},
                {key:'qq',img:'/qq-bg.png'}]"
                @click="(card)=>handlerCardClick(card)"
            />
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
            <template v-if="targetId==='1'">
              {{ groupChat?.targetInfo.name }}（{{ userListMap.size }}）
            </template>
            <template v-else>
              {{ currentSelectTarget?.targetInfo?.name }}
            </template>
            <div class="menu-btn" @click="showRight = true">
              <i class="iconfont icon-shezhi text-[24px]"/>
            </div>
          </div>
          <div class="middle-content">
            <div class="chat-show-area" ref="chatShowAreaRef">

              <div v-for="(item) in msgRecord" class="msg-item" :key="item.id"
                   :class="{right:item.fromId===currentUserId}">
                <template v-if="item.fromId!==currentUserId">
                  <linyu-avatar :text="item.fromInfo?.name" size="40px"
                                class="mr-[5px]"/>
                  <div class="msg-box">
                    <div class="flex items-center">
                      <div class="msg-username">
                        {{ item.fromInfo?.name }}
                      </div>
                      <div class="mgs-ip ml-[2px]">[{{ item.fromInfo.ipOwnership ?? "未知" }}]</div>
                    </div>
                    <div class="msg-content">
                      {{ item.message }}
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="msg-box">
                    <div class="flex items-center">
                      <div class="mgs-ip mr-[2px]">[{{ item.fromInfo.ipOwnership ?? "未知" }}]</div>
                      <div class="msg-username">
                        {{ item.fromInfo.name }}
                      </div>
                    </div>
                    <div class="msg-content">
                      {{ item.message }}
                    </div>
                  </div>
                  <linyu-avatar v-if="item.fromId===currentUserId" :text="item.fromInfo.name" size="40px"
                                class="ml-[5px]"/>
                </template>
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
              <linyu-avatar :text="currentUserName" size="40px" class="mr-[5px]"/>
              <div class="user-name">{{ currentUserName }}</div>
            </div>
            <div class="flex">
              <icon-button v-if="themeStore.theme==='light'" @click="(e)=>toggleDark(e,'dark')" icon="icon-taiyang"/>
              <icon-button v-if="themeStore.theme==='dark'" @click="(e)=>toggleDark(e,'light')" icon="icon-yueliang"/>
              <icon-button @click="handlerLogout" icon="icon-tuichu"/>
            </div>
          </div>
          <div class="right-content">
            <div class="flex justify-between items-center mb-[10px]">
              <div class="text-[rgb(var(--text-color))] text-[14px] font-[600]">在线人数（{{ onlineCount }}）</div>
              <linyu-input placeholder="搜索用户"
                           height="30px" width="140px" radius="40px" font-size="14px"
                           v-model:value="userSearchValue"
              />
            </div>
            <div class="online-list">
              <div v-for="(item,index) in userList"
                   class="online-list-item"
                   :key="item.id"
                   :class="{odd:index%2===0}">
                <div class="online-item-content">
                  <div class="w-[40px] h-[40px] relative">
                    <linyu-avatar :text="item.name" size="40px"/>
                    <div v-if="item.status?.length" class="online-status"/>
                  </div>
                  <div class="online-username">{{ item.name }}</div>
                  <linyu-tooltip v-if="item.status?.includes('web')" content="浏览器在线" class="ml-[2px]">
                    <img src="/badge/web-online.png" alt="" class="h-[18px]" draggable="false">
                  </linyu-tooltip>
                  <linyu-tooltip v-if="item.status?.includes('ssh')" content="SSH在线" class="ml-[2px]">
                    <img src="/badge/ssh-online.png" alt="" class="h-[18px]">
                  </linyu-tooltip>
                </div>
                <div class="online-item-operation ml-[20px]">
                  <linyu-text-button v-if="item.id!==currentUserId" text="私聊"
                                     @click="()=>{onCreatePrivateChat(item.id);closeMask()}"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {useThemeStore} from "@/stores/useThemeStore.js";
import IconButton from "@/components/IconButton.vue";
import {toggleDark} from "@/utils/theme.js";
import LinyuInput from "@/components/LinyuInput.vue";
import {useRouter} from "vue-router";
import LinyuAvatar from "@/components/LinyuAvatar.vue";
import ChatListApi from "@/api/chatList.js";
import LinyuDotHint from "@/components/LinyuDotHint.vue";
import MessageApi from "@/api/message.js";
import EventBus from "@/utils/eventBus.js";
import UserApi from "@/api/user.js";
import LinyuTooltip from "@/components/LinyuTooltip.vue";
import ws from "@/utils/ws.js";
import LinyuTextButton from "@/components/LinyuTextButton.vue";
import LinyuCardCarousel from "@/components/LinyuCardCarousel.vue";
import {useToast} from '@/components/ToastProvider.vue';

const themeStore = useThemeStore();
const router = useRouter();
const showToast = useToast()
let recordIndex = 0;
const currentUserId = localStorage.getItem('userId')
const currentUserName = localStorage.getItem('userName')
const showLeft = ref(false)
const showRight = ref(false)
const groupChat = ref()
const msgRecord = ref([])
const targetId = ref("1")
const currentSelectTarget = ref(null)
const msgContent = ref('')
const chatShowAreaRef = ref()
const isLoading = ref(false)
const isComplete = ref(false)
const userListMap = ref(new Map())
const onlineCount = ref(0)
const privateChatList = ref([])
const userSearchValue = ref('')

const handleScroll = () => {
  if (chatShowAreaRef.value) {
    if (chatShowAreaRef.value.scrollTop === 0 && !isLoading.value) {
      onGetMsgRecord();
    }
  }
};

const userList = computed(() => {
  const values = Array.from(userListMap.value.values());
  if (userSearchValue.value) {
    return values.filter(item => item.name.includes(userSearchValue.value));
  } else {
    return values;
  }
})

//接收到消息
const handlerReceiveMsg = (data) => {
  handlerUpdateChatList(data)
  if (data.fromId === currentUserId) return
  if (targetId.value === data.fromId ||
      (data.source === 'group' && targetId.value === "1")) {
    msgRecord.value.push(data)
    recordIndex++
    scrollToBottom()
  }
}

//更新聊天列表信息
const handlerUpdateChatList = (message) => {
  if (message.fromId === "1" || message.toId === "1") {
    groupChat.value.lastMessage = message
    return;
  }
  let i = 0
  while (i < privateChatList.value.length) {
    let chat = privateChatList.value[i]
    if (message.fromId === chat.targetId || message.toId === chat.targetId) {
      chat.lastMessage = message
      break;
    }
    i++
  }
  if (i >= privateChatList.value.length) {
    onGetPrivateChatList()
  }
}

//接收到通知
const handlerReceiveNotify = (data) => {
  let user = userListMap.value.get(data.content.id);
  if (!user) {
    user = data.content
    userListMap.value.set(user.id, user)
  }
  switch (data.type) {
    case "web-online":
      if (!user.status) {
        user.status = ['web'];
        handlerUserListSort();
      } else if (!user.status.includes('web')) {
        user.status = [...user.status, 'web'];
        handlerUserListSort();
      }
      break;
    case "web-offline":
      if (user.status) {
        user.status = user.status.filter(status => status !== 'web');
        handlerUserListSort();
      }
      break;
  }
}


onMounted(async () => {
  EventBus.on('on-receive-msg', handlerReceiveMsg)
  if (chatShowAreaRef.value) {
    chatShowAreaRef.value.addEventListener('scroll', handleScroll);
  }
  onGetGroupChat()
  onGetPrivateChatList()
  await onGetUserListMap()
  await onGetOnlineWeb()
  EventBus.on('on-receive-notify', handlerReceiveNotify)
  handlerUserListSort();
})


onUnmounted(() => {
  EventBus.off('on-receive-msg', handlerReceiveMsg)
})


const scrollToBottom = () => {
  if (chatShowAreaRef.value) {
    nextTick(() => chatShowAreaRef.value.scrollTop = chatShowAreaRef.value.scrollHeight);
  }
};

//卡片点击
const handlerCardClick = (card) => {
  switch (card.key) {
    case 'bili':
      window.open('https://space.bilibili.com/135427028/channel/series', '_blank')
      break;
    case 'github':
      window.open('https://github.com/linyu-im', '_blank')
      break;
    case 'qq':
      navigator.clipboard.writeText("729158695")
      showToast("QQ群号，已复制到粘贴板~")
      break;
  }
}

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
        msgRecord.value = [...newMessages.reverse(), ...msgRecord.value];
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
      recordIndex = 0
      msgRecord.value = []
      isComplete.value = false
      isLoading.value = false
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
  ws.disConnect()
  router.push('/login')
}

//获取群聊
const onGetGroupChat = () => {
  ChatListApi.group().then(res => {
    if (res.code === 0) {
      groupChat.value = res.data
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
      recordIndex++
      msgContent.value = ''
      scrollToBottom()
    }
  })
}

//获取用户列表
const onGetUserListMap = async () => {
  await UserApi.listMap().then(res => {
    if (res.code === 0) {
      userListMap.value = new Map(Object.entries(res.data));
    }
  })
}

//获取web在线人员
const onGetOnlineWeb = async () => {
  await UserApi.onlineWeb().then(res => {
    if (res.code === 0) {
      const onlineWeb = res.data;
      for (let i = 0; i < onlineWeb?.length; i++) {
        const user = userListMap.value.get(onlineWeb[i])
        user.status = Array.isArray(user.status) ? [...user.status, 'web'] : ['web'];
      }
    }
  });
};

//根据在线排序
const handlerUserListSort = () => {
  const sortedEntries = [...userListMap.value.entries()].sort(([, a], [, b]) => {
    const aStatus = a?.status || [];
    const bStatus = b?.status || [];
    const aStatusEmpty = aStatus.length === 0;
    const bStatusEmpty = bStatus.length === 0;
    if (aStatusEmpty && !bStatusEmpty) return 1;
    if (!aStatusEmpty && bStatusEmpty) return -1;
    return 0;
  });
  userListMap.value = new Map(sortedEntries);
  let onlineNum = 0
  for (let [, value] of userListMap.value) {
    if (value?.status?.length > 0) {
      onlineNum++
    } else {
      break
    }
  }
  onlineCount.value = onlineNum
};

//获取私聊列表
const onGetPrivateChatList = () => {
  ChatListApi.privateList().then(res => {
    if (res.code === 0) {
      privateChatList.value = res.data
    }
  })
}

//创建私聊
const onCreatePrivateChat = (id) => {
  ChatListApi.create({targetId: id}).then(res => {
    if (res.code === 0) {
      targetId.value = id
      onGetPrivateChatList()
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

      .vcard {
        cursor: pointer;
        height: 60px;
        border-radius: 5px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
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
        user-select: none;

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


    }

    .chat-list-content {
      flex: 1;
      overflow-y: scroll;
      padding-right: 5px;
      margin-right: -10px;
      margin-bottom: 20px;
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
        display: flex;
        flex-direction: column;

        .online-list {
          overflow-y: scroll;
          padding-right: 5px;
          margin-right: -5px;
          flex: 1;

          .online-list-item {
            height: 50px;
            border-radius: 5px;
            background-image: linear-gradient(to right, rgba(var(--minor-color), 0.2), rgba(var(--minor-color), 0));
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;

            .online-item-content {
              display: flex;
              align-items: center;

              .online-username {
                max-width: 100px;
                margin-left: 10px;
                font-weight: 600;
                color: rgb(var(--text-color));
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .online-status {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 10px;
                right: 0;
                bottom: 0;
                background-color: rgb(var(--primary-color));
                border: #FFFFFF 2px solid;
              }
            }

            .online-item-operation {
              align-items: center;
              opacity: 0;
              transition: opacity 0.5s ease;
              pointer-events: none;
            }

            &.odd {
              background-image: linear-gradient(to left, rgba(var(--minor-color), 0.2), rgba(var(--minor-color), 0));
            }

            &:hover {
              .online-item-operation {
                opacity: 1;
                pointer-events: auto;
              }
            }

            @media screen and (max-width: 900px) {
              .online-item-operation {
                opacity: 1;
                pointer-events: auto;
              }
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
