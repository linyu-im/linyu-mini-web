<template>
  <div class="linyu-loading">
    <div class="balls">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="props.label" class="mt-[10px]">{{ props.label }}</div>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
})
</script>

<style scoped>
.linyu-loading {
  color: rgba(var(--text-color), 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  user-select: none;
}

.balls {
  width: 50px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.balls div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(var(--primary-color));
  transform: translateY(-100%);
  animation: wave 0.8s ease-in-out alternate infinite;
}

.balls div:nth-of-type(1) {
  animation-delay: -0.4s;
}

.balls div:nth-of-type(2) {
  animation-delay: -0.2s;
}

@keyframes wave {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
