<template>
  <div class="carousel" @mouseenter="isExpansion = true" @mouseleave="isExpansion = false">
    <transition-group name="carousel" tag="div" class="carousel-wrapper">
      <div
        v-for="(card, index) in images"
        :key="card"
        class="vcard"
        :style="getCardStyle(index)"
        @click="handleCardClick(index, card)"
      >
        <div class="bg-image" :style="{ backgroundImage: `url(${card.img})` }" />
        <div class="bg-color" :style="bgColorStyle(index)"></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  play: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const images = ref([...props.images])
const currentIndex = ref(0)
const offset = ref(-8)
const isExpansion = ref(false)
let autoPlayInterval = null

watch(isExpansion, () => {
  if (isExpansion.value) offset.value = -35
  else offset.value = -8
})

const bgColorStyle = (index) => {
  const baseColor = 60 + index * 15
  return {
    backgroundColor: `rgba(${baseColor}, ${baseColor}, ${baseColor}, 1)`,
    opacity: index !== 0 && !isExpansion.value ? 1 : 0,
    transition: 'opacity 0.5s ease',
  }
}

const getCardStyle = (index) => {
  const zIndex = images.value.length - index
  return {
    zIndex,
    transform: `translateY(${offset.value * index}px) scale(${1 - 0.05 * index})`,
    cursor: index !== currentIndex.value ? 'pointer' : 'default',
  }
}

const handleCardClick = (index, card) => {
  emit('click', card)
  if (index !== currentIndex.value) {
    const clickedImage = images.value.splice(index, 1)[0]
    images.value.unshift(clickedImage)
    currentIndex.value = 0
  }
}

const startAutoPlay = () => {
  if (!autoPlayInterval) {
    autoPlayInterval = setInterval(() => {
      const lastImage = images.value.pop()
      images.value.unshift(lastImage)
    }, 3000) // Change images every 3 seconds
  }
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

watch(
  () => props.play,
  (newVal) => {
    if (newVal) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
  },
)

onMounted(() => {
  if (props.play) {
    startAutoPlay()
  }
})

onBeforeUnmount(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 60px;
  perspective: 1000px;
  margin: auto;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.vcard {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition:
    transform 0.4s ease,
    z-index 0.4s ease;
}

.bg-image,
.bg-color {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
}

.bg-image {
  transition: opacity 0.5s ease;
}

.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.4s ease;
}

.carousel-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.carousel-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
