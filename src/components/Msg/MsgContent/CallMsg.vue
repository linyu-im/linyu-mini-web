<template>
  <div class="call-msg">
    <i class="iconfont icon-yuyintonghua text-[16px] mr-[5px]" />
    <span>
      {{
        props.msg.message === '0'
          ? '通话未接通'
          : `通话时长 : ${formatTimingTime(props.msg.message)}`
      }}
    </span>
  </div>
</template>

<script setup>
import { formatTimingTime } from '@/utils/date.js'

const props = defineProps({ msg: Object, right: Boolean })
</script>

<style lang="less" scoped>
.call-msg {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
</style>
