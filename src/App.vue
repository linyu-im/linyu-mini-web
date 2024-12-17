<template>
  <ToastProvider>
    <div :data-theme="themeStore.theme">
      <RouterView/>
    </div>
  </ToastProvider>
</template>

<script setup>
import {RouterView} from 'vue-router'
import {useThemeStore} from "@/stores/useThemeStore.js";
import ToastProvider from "@/components/ToastProvider.vue";

const themeStore = useThemeStore();
</script>

<style scoped>
</style>
