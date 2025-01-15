<template>
  <div class="login-container">
    <div class="operations">
      <icon-button
        @click="() => openUrl('https://space.bilibili.com/135427028/channel/series')"
        icon="icon-bilibili"
      />
      <icon-button @click="() => openUrl('https://github.com/linyu-im')" icon="icon-github" />
      <icon-button
        v-if="themeStore.theme === 'light'"
        @click="(e) => toggleDark(e, 'dark')"
        icon="icon-taiyang"
      />
      <icon-button
        v-if="themeStore.theme === 'dark'"
        @click="(e) => toggleDark(e, 'light')"
        icon="icon-yueliang"
      />
    </div>
    <div class="login-bg">
      <img alt="" :src="`/poster-${themeStore.theme}.png`" class="poster-img" draggable="false" />
      <img class="logo" alt="" :src="`/title-${themeStore.theme}.png`" draggable="false" />
      <div class="login-content">
        <div v-if="!isVerifySuccess" class="login-box">
          <div class="title">
            <div
              class="text-[28px] text-[rgb(var(--text-color))] font-[600] leading-[28px] mb-[10px]"
            >
              Linyu在线聊天群
            </div>
            <div class="text-[18px] text-[rgba(var(--text-color),0.7)] leading-[20px]">
              欢迎使用林语mini
            </div>
          </div>
          <div class="info">
            <linyu-input
              v-model:value="password"
              placeholder="请输入群聊密码"
              type="password"
              @keydown.enter="onVerifyPassword"
            />
          </div>
          <div @click="onVerifyPassword" :class="['login-button', { logging: logging }]">
            {{ !logging ? '验 证' : '登 录 中' }}
          </div>
        </div>
        <div v-if="isVerifySuccess" class="login-box">
          <div class="title">
            <div class="text-[28px] text-[rgb(var(--text-color))] font-[600] leading-[28px]">
              填写个人信息
            </div>
          </div>
          <div class="info">
            <linyu-input
              v-model:value="username"
              class="mb-[10px]"
              placeholder="用户名"
              @keydown.enter="onLogin"
            />
            <linyu-input v-model:value="email" placeholder="邮箱" @keydown.enter="onLogin" />
          </div>
          <div @click="onLogin" :class="['login-button', { logging: logging }]">
            {{ !logging ? '进 入' : '请 等 待' }}
          </div>
        </div>
        <div class="web-info">
          <div class="text-[rgba(var(--text-color),0.7)]">Author : Heath</div>
          <div class="text-[rgba(var(--text-color),0.7)]">QQ群 : 729158695</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore.js'
import LinyuInput from '@/components/LinyuInput.vue'
import { toggleDark } from '@/utils/theme.js'
import IconButton from '@/components/LinyuIconButton.vue'
import { useToast } from '@/components/ToastProvider.vue'
import { useRoute, useRouter } from 'vue-router'
import LoginApi from '@/api/login.js'
import { JSEncrypt } from 'jsencrypt'
import { useUserInfoStore } from '@/stores/useUserInfoStore.js'

const themeStore = useThemeStore()
const userInfoStore = useUserInfoStore()
const router = useRouter()
const route = useRoute()

const logging = ref(false)
const isVerifySuccess = ref(false)
const password = ref(route.query.p)
const username = ref('')
const email = ref('')
const showToast = useToast()

const openUrl = (url) => {
  window.open(url, '_blank')
}
const onVerifyPassword = async () => {
  if (!password.value) {
    showToast('密码不能为空~', true)
    return
  }
  let keyData = await LoginApi.publicKey()
  if (keyData.code !== 0) {
    return
  }
  logging.value = true
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(keyData.data)
  const encryptedPassword = encrypt.encrypt(password.value)
  LoginApi.verify({ password: encryptedPassword })
    .then((res) => {
      if (res.code === 0) {
        localStorage.setItem('x-token', res.data)
        isVerifySuccess.value = true
      } else {
        showToast(res.msg, true)
      }
    })
    .catch((res) => {
      showToast(res.message, true)
    })
    .finally(() => {
      logging.value = false
    })
}
const onLogin = () => {
  if (!username.value) {
    showToast('用户名不能为空~', true)
    return
  }
  if (!password.value) {
    showToast('邮箱不能为空~', true)
    return
  }
  logging.value = true
  LoginApi.login({ name: username.value, email: email.value })
    .then((res) => {
      if (res.code === 0) {
        localStorage.setItem('x-token', res.data.token)
        userInfoStore.setUserInfo({
          userId: res.data.userId,
          userName: res.data.userName,
          email: res.data.email,
          avatar: res.data.avatar,
        })
        router.push('/')
      } else {
        showToast(res.msg, true)
      }
    })
    .catch((res) => {
      showToast(res.message, true)
    })
    .finally(() => {
      logging.value = false
    })
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  background: var(--screen-bg-color);

  .operations {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    @media screen and (max-height: 500px) {
      display: none;
    }
  }

  .login-bg {
    width: 100%;
    height: 100%;
    display: flex;
    background-image: var(--scrren-grid-bg-color);
    background-size: 50px 50px;
  }

  .poster-img {
    height: 100vh;
    min-width: 500px;
    @media screen and (max-width: 1000px) {
      display: none;
    }
  }

  .logo {
    margin: 15px;
    position: absolute;
    display: flex;
    height: 60px;
    @media screen and (max-width: 1000px) {
      height: 40px;
    }
    @media screen and (max-height: 500px) {
      display: none;
    }
  }

  .login-content {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 50px 50px;
    flex-direction: column;

    .web-info {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #ababab;
      @media screen and (max-height: 500px) {
        display: none;
      }
    }

    .login-box {
      width: 600px;
      height: 360px;
      border-radius: 10px;
      background-image: linear-gradient(
        130deg,
        rgba(var(--background-color), 0.3),
        rgba(var(--background-color), 0.5)
      );
      backdrop-filter: blur(10px);
      border: rgba(var(--background-color), 0.5) 3px solid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 60px;

      @media screen and (max-width: 1000px) {
        width: 95%;
        padding: 60px 20px;
      }

      .title {
        display: flex;
        flex-direction: column;
      }

      .info {
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .login-button {
        width: 100%;
        height: 50px;
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        background-color: rgb(var(--primary-color));
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;

        &.logging,
        &:hover {
          background-color: rgba(76, 155, 255, 0.8);
        }
      }
    }
  }
}
</style>
