<template>
  <div class="space-y-10">
    <div
      v-for="n in props.skeletonCount"
      :key="n"
      class="flex justify-end items-start"
      :class="{ reverse: n % 2 === 0 }"
    >
      <div class="w-14 h-14 rounded-full skeleton-shimmer" />
      <div class="flex-1 mx-2 flex flex-col space-y-2" :class="{ end: n % 2 === 0 }">
        <div class="w-1/4 h-6 rounded flicker" />
        <div class="w-full flex flex-col space-y-1" :class="{ end: n % 2 === 0 }">
          <div v-for="i in n" :key="i" class="w-2/3 h-6 rounded flicker" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  skeletonCount: {
    type: Number,
    default: 3,
  },
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}

.reverse {
  flex-direction: row-reverse;
}

.end {
  align-items: end;
}

.skeleton-shimmer {
  background: linear-gradient(90deg, rgba(var(--text-color), 0.1), rgba(var(--text-color), 0.2));
}

.flicker {
  background: linear-gradient(
    90deg,
    rgba(var(--text-color), 0.1) 25%,
    rgba(var(--text-color), 0.2) 37%,
    rgba(var(--text-color), 0.1) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
