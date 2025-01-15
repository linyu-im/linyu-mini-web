import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('user-info', {
  state: () => ({
    userId: '',
    userName: '',
    email: '',
    avatar: '',
  }),
  actions: {
    async setUserInfo(userInfo) {
      this.userId = userInfo.userId
      this.userName = userInfo.userName
      this.email = userInfo.email
      this.avatar = userInfo.avatar
    },
    async clearUserInfo() {
      this.userId = ''
      this.userName = ''
      this.email = ''
      this.avatar = ''
    },
    async setUserAvatar(avatar) {
      this.avatar = avatar
    },
  },
  persist: true,
})
