<template>
  <div class="linyu-msg-input-container">
    <teleport to="#app">
      <div
        v-if="isAtPopup && showMentionsPopup && userList.length > 0"
        class="at-mentions-popup"
        :style="`top:${popupPosition.y - 10}px;left:${popupPosition.x}px`"
        :data-theme="themeStore.theme"
      >
        <div
          v-for="(item, index) in userList"
          :key="item.id"
          class="user-item"
          :class="{ selected: index === selectedUserIndex }"
          @click="() => onSelectUser(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </teleport>
    <div
      autofocus
      ref="inputRef"
      tabindex="0"
      contenteditable
      class="linyu-msg-input"
      @keyup="onInputKeyUp"
      @keydown="onInputKeyDown"
      @input="onInputText"
      @blur="onInputBlur"
      @focus="onInputFocus"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore.js'

const themeStore = useThemeStore()

const inputRef = ref()
const popupPosition = ref({ x: 0, y: 0 })
const showMentionsPopup = ref(false)
const searchKey = ref('')
const selectedUserIndex = ref(0)

const inputValue = defineModel('value')
let nodeList = []

const selection = ref({
  sel: null,
  range: null,
  node: null,
  offset: 0,
  text: '',
})

const emit = defineEmits(['send'])

const props = defineProps({ user: Object, isAtPopup: Boolean })

const userList = computed(() => {
  if (props.user) {
    return props.user.filter((item) => item.name.includes(searchKey.value))
  } else {
    return props.user
  }
})

const onInputText = () => {
  inputValue.value = inputRef.value.innerText
}

watch(inputValue, () => {
  if (!inputValue.value) {
    inputRef.value.innerText = ''
  } else {
    onDataChange()
  }
})

const onInputBlur = () => {
  updateSelection()
  setTimeout(() => {
    showMentionsPopup.value = false
  }, 200)
}

const onInputFocus = () => {
  checkIsShowSelectPopup()
}

const onInputKeyDown = (e) => {
  const isEnterKey = e.key === 'Enter'
  const isArrowUp = e.key === 'ArrowUp'
  const isArrowDown = e.key === 'ArrowDown'
  const isTabKey = e.key === 'Tab'
  const isCtrlOrMeta = e.ctrlKey || e.metaKey

  if (showMentionsPopup.value && userList.value.length > 0) {
    if (isArrowUp) {
      e.preventDefault()
      if (selectedUserIndex.value > 0) {
        selectedUserIndex.value--
        scrollToSelectedUser()
      }
    } else if (isArrowDown) {
      e.preventDefault()
      if (selectedUserIndex.value < userList.value.length - 1) {
        selectedUserIndex.value++
        scrollToSelectedUser()
      }
    } else if (isEnterKey) {
      e.preventDefault()
      onSelectUser(userList.value[selectedUserIndex.value])
    }
  } else {
    if (isEnterKey) {
      if (e.ctrlKey || e.shiftKey || e.metaKey) {
        e.preventDefault()
      } else {
        e.preventDefault()
        emit('send', e)
      }
    }
  }
  if (isCtrlOrMeta) {
    if (['B', '2', 'I', '9', 'U', 'F6'].includes(e.key)) {
      e.preventDefault()
    }
  }
  if (isTabKey) {
    e.preventDefault()
  }
}

watch(showMentionsPopup, () => {
  if (showMentionsPopup.value) {
    popupPosition.value = getAtMentionsPosition()
  }
})

const scrollToSelectedUser = () => {
  const listElement = document.querySelector('.at-mentions-popup')
  const selectedElement = listElement?.children[selectedUserIndex.value]
  if (selectedElement && listElement) {
    const listRect = listElement.getBoundingClientRect()
    const selectedRect = selectedElement.getBoundingClientRect()
    if (selectedRect.top < listRect.top) {
      // 如果选中项在列表可视区域上方
      listElement.scrollTop -= listRect.top - selectedRect.top
    } else if (selectedRect.bottom > listRect.bottom) {
      // 如果选中项在列表可视区域下方
      listElement.scrollTop += selectedRect.bottom - listRect.bottom
    }
  }
}

const onInputKeyUp = (e) => {
  updateSelection()
  if (e.key === '@') {
    selectedUserIndex.value = 0
    showMentionsPopup.value = true
    searchKey.value = ''
  } else {
    checkIsShowSelectPopup()
  }
}

const onSelectUser = (selectedUser) => {
  if (!props.isAtPopup) return
  const input = inputRef.value
  if (!input || !selection.value.node) return

  const range = document.createRange()
  let node = selection.value.node
  let offset = selection.value.offset

  // 向前查找 @ 符号
  while (offset > 0) {
    if (node.textContent[offset - 1] === '@') {
      break
    }
    offset--
  }

  // 创建新范围并插入提及按钮
  range.setStart(node, offset - 1)
  range.setEnd(node, selection.value.offset)
  range.deleteContents()

  const button = document.createElement('button')
  button.textContent = ` @${selectedUser.name} `
  button.user = JSON.stringify(selectedUser)
  button.contentEditable = 'false'
  button.className = 'mention-button'
  button.setAttribute(
    'style',
    `color:rgb(var(--primary-color));
    border:none;
    background:transparent;
    margin:0 2px;
    font-size:inherit`,
  )

  range.insertNode(button)
  range.setStartAfter(button)
  range.setEndAfter(button)
  // 更新选区
  const newSel = document.getSelection()
  newSel.removeAllRanges()
  newSel.addRange(range)
  showMentionsPopup.value = false
  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
      cancelable: true,
    }),
  )
}

const updateSelection = () => {
  const input = inputRef.value
  if (!input) return
  // 获取当前选区信息
  const sel = document.getSelection()
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0)
    selection.value = {
      sel: sel,
      range: range,
      node: range.endContainer,
      offset: range.endOffset,
      text: range.toString(),
    }
  }
}

const checkIsShowSelectPopup = () => {
  if (!selection.value.node || selection.value.node.nodeName !== '#text') {
    showMentionsPopup.value = false
    return
  }

  const searchStr = selection.value.node.textContent.slice(0, selection.value.offset)
  const keywords = /@([^@]*)$/.exec(searchStr)

  if (keywords && keywords.length >= 2) {
    const [, keyWord] = keywords
    showMentionsPopup.value = true
    searchKey.value = keyWord
  } else {
    searchKey.value = ''
    showMentionsPopup.value = false
  }
}

const getAtMentionsPosition = () => {
  if (!selection.value.node) return { x: 0, y: 0 }

  const range = document.createRange()
  range.setStart(selection.value.node, selection.value.offset)
  range.collapse(true)

  const rect = range.getBoundingClientRect()
  let x = rect.left
  let y = rect.top

  if (inputRef.value) {
    const inputWidth = inputRef.value.offsetWidth
    const inputLeft = inputRef.value.getBoundingClientRect().left
    const inputRight = inputLeft + inputWidth
    const popupWidth = 150

    if (x + popupWidth > inputRight) {
      x = inputRight - popupWidth
    }
  }

  return { x, y }
}

const onDataChange = () => {
  if (inputRef.value) {
    const newNodeList = []
    const editorChildNodes = [].slice.call(inputRef.value.childNodes)
    if (editorChildNodes.length > 0) {
      editorChildNodes.forEach((element) => {
        // 文本
        if (element.nodeName === '#text') {
          if (element.data && element.data.length > 0) {
            newNodeList.push({
              type: 'text',
              content: element.data,
            })
          }
        }
        // button
        if (element.nodeName === 'BUTTON') {
          newNodeList.push({
            type: 'at',
            content: element.user,
          })
        }
      })
    }
    nodeList = newNodeList
  }
}

const insertInputText = (content) => {
  const sel = selection.value.sel
  const range = selection.value.range
  if (!sel || !range || !content) return
  if (sel.getRangeAt(0) && sel.rangeCount) {
    range.deleteContents()
    const el = document.createElement('div')
    const text = document.createTextNode(content)
    el.appendChild(text)
    const frag = document.createDocumentFragment()
    let node
    let lastNode
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node)
    }
    range.insertNode(frag)
    if (lastNode) {
      const newRange = range.cloneRange()
      if (!newRange) return
      newRange.setStartAfter(lastNode)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
    }
  }
  inputValue.value = inputRef.value.innerText
}

defineExpose({
  focus() {
    inputRef.value?.focus()
  },
  getRange() {
    return selection.value.range
  },
  insertInputText(text) {
    insertInputText(text)
  },
  getNodeList() {
    return nodeList
  },
})
</script>

<style scoped lang="less">
.linyu-msg-input-container {
  width: 100%;
  position: relative;
  white-space: pre-wrap;

  .linyu-msg-input {
    max-height: 100px;
    overflow: hidden;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    outline: none;
    resize: none;
    border-radius: 0;
    background-color: rgb(var(--background-color));
    border: rgba(var(--background-color), 0.5) 2px solid;
    color: rgb(var(--text-color));
  }
}

.mention-button {
  background: transparent;
  border: none;
  color: rgba(var(--text-color));
  cursor: pointer;
  padding: 2px 4px;
  margin: 0 4px;
  font-size: 14px;
}

.at-mentions-popup {
  position: fixed;
  width: 180px;
  max-height: 150px;
  transform: translateY(-100%);
  background-color: rgba(var(--background-color), 0.6);
  backdrop-filter: blur(8px);
  border-radius: 5px;
  padding: 5px;
  overflow-y: auto;
  color: rgba(var(--text-color));
  border: rgba(var(--primary-color), 0.2) 1px solid;

  .user-item {
    padding: 5px 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;

    &:hover {
      background-color: rgba(var(--background-color));
      border-radius: 5px;
      user-select: none;
      cursor: pointer;
    }

    &.selected {
      background-color: rgba(var(--primary-color), 0.2);
    }
  }
}
</style>
