<template>
  <CustomModal v-model:is-open="isOpen">
    <div class="w-screen h-screen flex justify-center items-center">
      <div class="custom-dialog">
        <div class="flex justify-between items-center mb-[10px]">
          <div class="font-[600] text-[20px]">{{ props.title }}</div>
        </div>
        <div class="flex-1">
          <div>{{ props.content }}</div>
        </div>
        <div class="flex justify-end">
          <linyu-button type="minor" style="width: 80px" @click="onCancel">取 消</linyu-button>
          <linyu-button style="width: 80px; margin-left: 10px" @click="onOk">确 定</linyu-button>
        </div>
      </div>
    </div>
  </CustomModal>
</template>
<script setup>
import CustomModal from '@/components/LinyuModal.vue'
import LinyuButton from '@/components/LinyuButton.vue'

const props = defineProps({
  title: {
    default: '',
  },
  content: {
    default: '',
  },
})

const emit = defineEmits(['cancel', 'ok'])
const isOpen = defineModel('isOpen')

const onCancel = () => {
  emit('cancel')
}

const onOk = () => {
  emit('ok')
}
</script>

<style lang="less" scoped>
.custom-dialog {
  width: 380px;
  height: 180px;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;

  .close-icon {
    background-color: transparent;

    &:hover {
      color: #ffffff;
      background: #ff4c4c;
    }
  }

  @media screen and (max-width: 500px) {
    width: 80%;
  }
}
</style>
