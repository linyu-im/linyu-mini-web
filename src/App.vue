<template>
  <ToastProvider>
    <div :data-theme="themeStore.theme">
      <linyu-dialog :is-open="globalStore.isOpenGlobalDialog"
                    :title="globalStore.dialogTitle"
                    :content="globalStore.dialogContent"
                    @ok="handlerLogout"
                    @cancel="handlerLogout"
      />
      <RouterView/>
    </div>
  </ToastProvider>
</template>

<script setup>
import {RouterView, useRouter} from 'vue-router'
import {useThemeStore} from "@/stores/useThemeStore.js";
import ToastProvider from "@/components/ToastProvider.vue";
import LinyuDialog from "@/components/LinyuDialog.vue";
import {useGroupStore} from "@/stores/useGroupStore.js";
import {useGlobalStore} from "@/stores/useGlobalStore.js";
import ws from "@/utils/ws.js";

const themeStore = useThemeStore();
const globalStore = useGlobalStore();
const router = useRouter();
const handlerLogout = () => {
  localStorage.removeItem("x-token")
  ws.disConnect()
  router.push('/login')
  globalStore.closeGlobalDialog()
}
</script>

<style scoped>
</style>
