<template>
  <linyu-modal :is-open="isOpen">
    <div class="modify-user-info" @click.stop>
      <linyu-avatar :info="{ name: name, avatar: avatar }" size="70px" />
      <linyu-input
        v-model:value="avatar"
        label="头像URL"
        placeholder="请输入头像URL"
        height="40px"
        font-size="14px"
      />
      <linyu-input
        v-model:value="name"
        label="用户名"
        placeholder="请输入用户名"
        height="40px"
        font-size="14px"
        :readonly="true"
      />
      <linyu-input
        v-model:value="email"
        label="邮箱"
        placeholder="请输入邮箱"
        height="40px"
        font-size="14px"
        :readonly="true"
      />
      <div class="flex gap-[15px] w-full justify-end mt-[20px]">
        <linyu-button type="minor" @click="isOpen = false">取消</linyu-button>
        <linyu-button @click="onUpdateUser">确定</linyu-button>
      </div>
    </div>
  </linyu-modal>
</template>
<script setup>
import LinyuModal from '@/components/LinyuModal.vue'
import LinyuAvatar from '@/components/LinyuAvatar.vue'
import LinyuInput from '@/components/LinyuInput.vue'
import LinyuButton from '@/components/LinyuButton.vue'
import { ref, watch } from 'vue'
import { useUserInfoStore } from '@/stores/useUserInfoStore.js'
import UserApi from '@/api/user.js'
import { useToast } from '@/components/ToastProvider.vue'

const showToast = useToast()
const isOpen = defineModel('isOpen')

const userInfoStore = useUserInfoStore()
const name = ref(userInfoStore.userName)
const email = ref(userInfoStore.email)
const avatar = ref(userInfoStore.avatar)

watch(isOpen, (newVal) => {
  if (newVal) {
    name.value = userInfoStore.userName
    email.value = userInfoStore.email
    avatar.value = userInfoStore.avatar
  }
})

const onUpdateUser = () => {
  UserApi.update({ name: name.value, avatar: avatar.value }).then((res) => {
    if (res.code === 0) {
      userInfoStore.setUserAvatar(avatar.value)
      showToast('修改成功~')
      isOpen.value = false
    }
  })
}
</script>
<style lang="less" scoped>
.modify-user-info {
  width: 500px;
  height: 350px;
  background-image: linear-gradient(
    130deg,
    rgba(var(--background-color), 0.7),
    rgba(var(--background-color), 0.9)
  );
  backdrop-filter: blur(10px);
  border: rgba(var(--background-color), 0.5) 3px solid;
  max-width: 90%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 15px;
}
</style>
