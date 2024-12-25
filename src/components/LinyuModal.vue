<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click="()=>console.log(21321321)">
      <div @click.stop>
        <slot/>
      </div>
    </div>
  </Transition>
</template>

<script setup>

const isOpen = defineModel('isOpen')

</script>

<style lang="less" scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: rgba(31, 31, 31, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>