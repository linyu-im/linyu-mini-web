<template>
  <div class="chat-container">
    <div class="chat-bg">
      <div class="chat-box">
        <!-- 左侧菜单 -->
        <div class="box-left" :class="{'show-left': showLeft}">
          <div class="chat-list-title">
            消息列表
            <div class="close-btn" @click="showLeft = false">×</div>
          </div>
          <div class="chat-list-item black">
            <div class="chat-item-avatar"></div>
            <div class="chat-item-content">
              <div class="chat-content-name">linyu在线聊天群</div>
              <div class="chat-content-msg">这是一条消息</div>
            </div>
          </div>
          <div class="text-[rgba(var(--text-color),0.7)] font-[600] mb-[5px]">私聊</div>
          <div class="chat-list-content">
            <div class="chat-list-item blue">
              <div class="chat-item-avatar"></div>
              <div class="chat-item-content">
                <div class="chat-content-name">linyu聊天群</div>
                <div class="chat-content-msg">这是一条消息</div>
              </div>
            </div>
            <div class="chat-list-item white">
              <div class="chat-item-avatar"></div>
              <div class="chat-item-content">
                <div class="chat-content-name">linyu聊天群</div>
                <div class="chat-content-msg">这是一条消息</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 遮罩层 -->
        <div class="mask" v-if="showLeft || showRight" @click="closeMask"></div>
        <!-- 中间部分 -->
        <div class="box-middle">
          <div class="middle-top">
            <div class="menu-btn" @click="showLeft = true">
              <i class="iconfont icon-liebiao text-[24px]"/>
            </div>
            linyu在线聊天群
            <div class="menu-btn" @click="showRight = true">
              <i class="iconfont icon-shezhi text-[24px]"/>
            </div>
          </div>
          <div class="middle-content">
            <div class="chat-show-area">
              <div class="msg-item">
                <div class="w-[40px] h-[40px] bg-gray-500 rounded-[40px] mr-[10px] shrink-0"></div>
                <div class="msg-box">
                  <div class="text-[rgba(var(--text-color),0.7)] mb-[5px] select-none">heath</div>
                  <div class="msg-content">
                    在么?
                  </div>
                </div>
              </div>

              <div class="msg-item">
                <div class="w-[40px] h-[40px] bg-gray-500 rounded-[40px] mr-[10px] shrink-0"></div>
                <div class="msg-box">
                  <div class="text-[rgba(var(--text-color),0.7)] mb-[5px]">heath</div>
                  <div class="msg-content">
                    你今天怎么样？
                  </div>
                </div>
              </div>

              <div class="msg-item right">
                <div class="msg-box">
                  <div class="text-[rgba(var(--text-color),0.7)] mb-[5px]">heath</div>
                  <div class="msg-content">
                    你今天怎么样？
                  </div>
                </div>
                <div class="w-[40px] h-[40px] bg-gray-500 rounded-[40px] ml-[10px] shrink-0"></div>
              </div>
            </div>

            <div class="chat-input-area">
              <div class="input-box"></div>
              <div class="publish-button">
                <i class="iconfont icon-fasong2 text-[28px]"/>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧菜单 -->
        <div class="box-right" :class="{'show-right': showRight}">
          <div class="right-top">
            <div class="flex items-center">
              <div class="user-avatar"></div>
              <div class="user-name">heath</div>
            </div>
            <div class="flex">
              <icon-button v-if="themeStore.theme==='light'" @click="(e)=>toggleDark(e,'dark')" icon="icon-taiyang"/>
              <icon-button v-if="themeStore.theme==='dark'" @click="(e)=>toggleDark(e,'light')" icon="icon-yueliang"/>
              <icon-button @click="" icon="icon-tuichu"/>
            </div>
          </div>
          <div class="right-content">
            <div class="flex justify-between items-center mb-[10px]">
              <div class="text-[rgb(var(--text-color))] text-[14px] font-[600]">在线人数（20）</div>
              <div class="w-[140px] h-[30px] bg-[#F9FBFF] rounded-[30px]"></div>
            </div>
            <div class="online-list">
              <div class="online-list-item">
                <div class="w-[40px] h-[40px] rounded-[50px] bg-gray-500"></div>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
              <div class="online-list-item odd">
                <div class="w-[40px] h-[40px] rounded-[50px] bg-gray-500"></div>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
              <div class="online-list-item">
                <div class="w-[40px] h-[40px] rounded-[50px] bg-gray-500"></div>
                <div class="ml-[10px] font-[600] text-[rgb(var(--text-color))]">heath</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useThemeStore} from "@/stores/useThemeStore.js";
import IconButton from "@/components/IconButton.vue";
import {toggleDark} from "@/utils/theme.js";

const themeStore = useThemeStore();

const showLeft = ref(false)
const showRight = ref(false)

const closeMask = () => {
  showLeft.value = false
  showRight.value = false
}


</script>


<style lang="less" scoped>
.chat-container {
  width: 100%;
  height: 100%;
  position: absolute;
  background: var(--screen-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;

  .chat-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-image: var(--scrren-grid-bg-color);
    background-size: 50px 50px;
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .chat-box {
    width: 80%;
    height: 90%;
    display: flex;
    position: relative;
    min-width: min-content;

    @media screen and (max-width: 900px) {
      width: 95%;
      height: 95%;
    }

    .box-left {
      width: 280px;
      min-width: 280px;
      background-color: rgba(var(--background-color), 0.5);
      backdrop-filter: blur(8px);
      margin-right: 5px;
      border-radius: 5px;
      border: rgba(var(--background-color), 0.5) 3px solid;
      display: flex;
      flex-direction: column;
      padding: 0 10px;

      @media screen and (max-width: 900px) {
        position: fixed;
        left: -280px;
        top: 0;
        bottom: 0;
        margin: 0;
        z-index: 11;
        transition: all 0.3s;
        background-color: rgba(var(--background-color), 0.9);

        &.show-left {
          left: 0;
        }
      }

      .chat-list-title {
        color: rgb(var(--text-color));
        height: 60px;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        user-select: none;
        @media screen and (max-width: 900px) {
          justify-content: space-between;
        }
      }


      .chat-list-item {
        height: 60px;
        margin-bottom: 5px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;

        .chat-item-avatar {
          width: 48px;
          height: 48px;
          border-radius: 25px;
          background-color: #2c3e50;
          margin-right: 10px;
        }

        .chat-item-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .chat-content-name {
            font-size: 14px;
            color: white;
            margin-bottom: 5px;
          }

          .chat-content-msg {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
          }
        }

        &.blue {
          background-color: rgb(var(--primary-color));

          &:hover {
            background-color: rgba(var(--primary-color), 0.7);
          }
        }

        &.black {
          background-color: rgba(151, 151, 151, 0.6);

          &:hover {
            background-color: rgba(151, 151, 151, 0.5);
          }
        }

        &.white {
          background-color: rgba(var(--background-color), 0.5);

          .chat-item-content {
            .chat-content-name {
              color: rgb(var(--text-color));
            }

            .chat-content-msg {
              color: rgba(var(--text-color), 0.6);
            }
          }

          &:hover {
            background-color: rgba(var(--background-color), 0.8);
          }
        }

      }

      .chat-list-content {
        flex: 1;
        overflow-y: scroll;
        padding-right: 5px;
        margin-right: -10px;
      }

    }

    .box-middle {
      min-width: 300px;
      flex: 1;
      margin-right: 5px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;


      @media screen and (max-width: 900px) {
        margin: 0;
      }


      .middle-top {
        height: 60px;
        min-height: 60px;
        background-color: rgba(var(--background-color), 0.5);
        backdrop-filter: blur(8px);
        margin-bottom: 5px;
        border-radius: 5px;
        border: rgba(var(--background-color), 0.5) 3px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 15px;
        font-size: 18px;
        font-weight: 600;
        user-select: none;
        color: rgb(var(--text-color));

        .menu-btn {
          cursor: pointer;
          font-size: 24px;
        }

        @media screen and (max-width: 900px) {
          justify-content: space-between;
        }

        @media screen and (min-width: 900px) {
          .menu-btn {
            display: none;
          }
        }
      }

      .middle-content {
        flex: 1;
        min-height: 300px;
        border-radius: 5px;
        background-image: linear-gradient(130deg, rgba(var(--background-color), 0.3), rgba(var(--background-color), 0.5));
        backdrop-filter: blur(10px);
        border: rgba(var(--background-color), 0.5) 3px solid;
        display: flex;
        flex-direction: column;

        .chat-show-area {
          flex: 1;
          padding: 10px;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;

          .msg-item {
            display: flex;
            margin-bottom: 15px;

            .msg-box {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              width: 100%;

              .msg-content {
                display: inline-block;
                word-break: break-word;
                max-width: 50%;
                background-color: white;
                padding: 10px;
                border-radius: 0 10px 10px 10px;
              }
            }


            &.right {
              justify-content: flex-end;

              .msg-box {
                align-items: flex-end;

                .msg-content {
                  border-radius: 10px 0 10px 10px;
                  background-color: rgb(var(--primary-color));
                  color: white;
                }
              }
            }
          }
        }

        .chat-input-area {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;

          .input-box {
            background-color: rgb(var(--background-color));
            height: 50px;
            width: 80%;
            border-radius: 50px;
            border: rgba(var(--background-color), 0.5) 2px solid;
            margin-right: 10px;
          }

          .publish-button {
            height: 55px;
            width: 55px;
            border-radius: 50px;
            background-color: rgb(var(--primary-color));
            border: rgba(var(--background-color), 0.5) 2px solid;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
      }
    }

    .box-right {
      width: 280px;
      min-width: 280px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;


      @media screen and (max-width: 900px) {

        position: fixed;
        right: -280px;
        top: 0;
        bottom: 0;
        margin: 0;
        z-index: 11;
        transition: all 0.3s;

        &.show-right {
          right: 0;
        }

        .right-top {
          background-color: rgba(var(--background-color), 0.9) !important;
        }

        .right-content {
          background-color: rgba(var(--background-color), 0.9) !important;
        }
      }

      .right-top {
        height: 60px;
        min-height: 60px;
        background-color: rgba(var(--background-color), 0.5);
        backdrop-filter: blur(8px);
        margin-bottom: 5px;
        border-radius: 5px;
        border: rgba(var(--background-color), 0.5) 3px solid;
        display: flex;
        align-items: center;
        padding: 5px;
        user-select: none;
        justify-content: space-between;

        .user-avatar {
          height: 40px;
          width: 40px;
          background-color: rgb(var(--primary-color));
          border-radius: 40px;
          margin-right: 5px;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: rgb(var(--text-color));
        }

        .user-operate {
          font-size: 14px;
          font-weight: 600;
          color: rgb(var(--primary-color));
          cursor: pointer;
        }
      }

      .right-content {
        flex: 1;
        min-height: 300px;
        background-color: rgba(var(--background-color), 0.5);
        backdrop-filter: blur(8px);
        border-radius: 5px;
        border: rgba(var(--background-color), 0.5) 3px solid;
        padding: 5px;

        .online-list {
          overflow-y: scroll;

          .online-list-item {
            height: 50px;
            border-radius: 5px;
            background-image: linear-gradient(to right, rgba(var(--minor-color), 0.4), rgba(var(--minor-color), 0));
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            padding: 10px;

            &.odd {
              background-image: linear-gradient(to left, rgba(var(--minor-color), 0.4), rgba(var(--minor-color), 0));
            }
          }
        }
      }
    }
  }

  .close-btn {
    cursor: pointer;
    font-size: 24px;
    padding: 0 10px;

    @media screen and (min-width: 900px) {
      display: none;
    }
  }
}
</style>
