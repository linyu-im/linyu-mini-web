<template>
  <div class="recall-msg">
    <div class="recall-content">
      {{ formatTime(props.content) }}
    </div>
  </div>
</template>
<script setup>
import { formatTime } from '@/utils/date.js'

const props = defineProps({
  content: String,
})
</script>
<style>
.recall-msg {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  .recall-content {
    padding: 2px 10px;
    background-color: rgba(var(--background-color));
    border-radius: 5px;
    color: rgba(var(--text-color), 0.5);
    font-size: 12px;
    display: flex;
  }
}
</style>
