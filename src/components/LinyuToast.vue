<template>
  <div class="toast-container">
    <div :class="['toast', { error: props.error }]">
      {{ props.message }}
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  message: String,
  error: Boolean,
  duration: Number,
})

const emit = defineEmits(['close'])

onMounted(() => {
  const timer = setTimeout(() => {
    emit('close')
  }, props.duration)
  onBeforeUnmount(() => clearTimeout(timer))
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 30px;
  padding: 6px 15px;
  background-color: #4c9bff;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: fadeInOut 3s;
}

.toast.error {
  background-color: #ff4c4c;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

.toast-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1211;
}
</style>
