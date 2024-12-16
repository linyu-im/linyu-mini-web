<template>
  <div :data-theme="themeStore.theme">
    <RouterView/>
  </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import {useThemeStore} from "@/stores/useThemeStore.js";

const themeStore = useThemeStore();
</script>

<style scoped>
</style>
