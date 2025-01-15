import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isOpenGlobalDialog: false,
    dialogTitle: '',
    dialogContent: '',
  }),
  actions: {
    setGlobalDialog(isOpen, title, content) {
      this.isOpenGlobalDialog = isOpen
      this.dialogTitle = title
      this.dialogContent = content
    },
    closeGlobalDialog() {
      this.isOpenGlobalDialog = false
    },
  },
})
