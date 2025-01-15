import { defineStore } from 'pinia'

export const useChatMsgStore = defineStore('chat-msg', {
  state: () => ({
    referenceMsg: null, //要引用的消息
    userListMap: new Map(), //全部用户
  }),
  actions: {
    setReferenceMsg(msg) {
      this.referenceMsg = msg
    },
    setUserListMap(map) {
      this.userListMap = map
    },
  },
})
