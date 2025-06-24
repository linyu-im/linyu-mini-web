<template>
  <span v-if="isArrayContents" class="text-msg">
    <template v-for="item in contents" :key="item.id">
      <!-- 保留 @ 提及的渲染逻辑 -->
      <span v-if="item.type === TextContentType.At" class="text-msg-at" :class="{ right: right }">
        {{ `@${getUserInfo(item.content).name}` }}
      </span>
      <span v-if="item.type === TextContentType.Text" v-html="renderMarkdown(item.content)" />
    </template>
  </span>
  <div v-else v-html="renderMarkdown(props.msg.message)" />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { TextContentType } from '@/constant/textContentType.js'

// 初始化 Markdown 解析器（带代码高亮）
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch {
        return ''
      }
    }
    return ''
  },
})

const props = defineProps({ msg: Object, right: Boolean })
const contents = ref()

const renderMarkdown = (content) => {
  return content ? md.render(content) : ''
}

watch(
  () => props.msg,
  () => {
    try {
      contents.value = JSON.parse(props.msg?.message)
    } catch {
      contents.value = props.msg?.message
    }
  },
  { immediate: true },
)

const isArrayContents = computed(() => Array.isArray(contents.value))
const getUserInfo = (content) => {
  try {
    return JSON.parse(content)
  } catch {
    return content
  }
}
</script>

<style lang="less" scoped>
.text-msg {
  .text-msg-at {
    color: rgba(var(--primary-color));
    font-style: italic;
    margin: 0 2px;
    cursor: pointer;
    font-weight: 600;
    display: inline-block;

    &.right {
      color: white;
    }
  }
}

:deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  padding: 0.8em;
  background-color: #f8f8f8;
  border-radius: 4px;
}

:deep(code) {
  word-wrap: break-word;
  white-space: pre-wrap;
}

:deep(p) {
  display: inline;
}

:deep(div) {
  display: inline;
}
</style>
