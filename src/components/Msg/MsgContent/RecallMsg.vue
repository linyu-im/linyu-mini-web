<template>
  <div class="recall-msg">
    <div class="recall-content">
      <div class="recall-content-name">{{ props.msg.fromInfo.name }}</div>
      撤回一条消息
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  msg: Object,
})
</script>
<style>
.recall-msg {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  .recall-content {
    padding: 2px 10px;
    background-color: rgba(var(--background-color));
    border-radius: 5px;
    color: rgba(var(--text-color), 0.5);
    font-size: 12px;
    display: flex;

    .recall-content-name {
      font-weight: 600;
      margin-right: 5px;
      color: rgb(var(--primary-color));
    }
  }
}
</style>
