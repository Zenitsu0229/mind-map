<template>
  <div
    class="node"
    :style="nodePositionStyle"
    @click.stop="onClickNode"
    @dblclick.stop="onDblClick"
    @mousedown.stop
  >
    <div
      class="node-box"
      :class="{
        root:     node.parentId === null,
        selected: isSelected,
        editing:  isEditing,
      }"
    >
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="editText"
        class="node-input"
        :style="fontStyle"
        @blur="onBlur"
        @keydown.enter.prevent="onEnter"
        @keydown.escape.prevent="onEscape"
        @mousedown.stop
        @click.stop
      />
      <span v-else class="node-text" :style="fontStyle">
        {{ node.text || '…' }}
      </span>
    </div>

    <!-- 右側の＋ボタン -->
    <button
      class="add-btn"
      title="子ノードを追加 (Tab)"
      @click.stop="store.addChild(node.id)"
      @mousedown.stop
    >+</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useMindMapStore } from '../stores/mindmapStore'
import type { MindNode } from '../types'
import { NODE_W, NODE_H } from '../composables/useLayout'

const props = defineProps<{ node: MindNode }>()

const store    = useMindMapStore()
const inputRef = ref<HTMLInputElement | null>(null)
const editText = ref(props.node.text)

const isSelected = computed(() => store.selectedId === props.node.id)
const isEditing  = computed(() => store.editingId  === props.node.id)

const nodePositionStyle = computed(() => ({
  left: `${props.node.x - NODE_W / 2}px`,
  top:  `${props.node.y - NODE_H / 2}px`,
}))

const fontStyle = computed(() => {
  if (props.node.depth === 0) return { fontSize: '14px', fontWeight: '600' }
  if (props.node.depth === 1) return { fontSize: '13px', fontWeight: '500' }
  return { fontSize: '12px', fontWeight: '400' }
})

watch(isEditing, async (val) => {
  if (val) {
    editText.value = props.node.text
    await nextTick()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
})

watch(() => props.node.text, (val) => {
  if (!isEditing.value) editText.value = val
})

function onClickNode(): void {
  if (!isEditing.value) store.selectNode(props.node.id)
}

function onDblClick(): void {
  store.startEdit(props.node.id)
}

function onBlur(): void {
  store.updateText(props.node.id, editText.value)
  store.finishEdit(props.node.id)
}

function onEnter(): void {
  store.updateText(props.node.id, editText.value)
  store.finishEdit(props.node.id)
}

function onEscape(): void {
  editText.value = props.node.text
  store.finishEdit(props.node.id)
}
</script>

<style scoped>
.node {
  position: absolute;
  width: v-bind('NODE_W + "px"');
  z-index: 1;
}

.node:hover { z-index: 2; }

/* ── 枠線のみのシンプルなボックス ── */
.node-box {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  min-height: v-bind('NODE_H + "px"');
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.1s;
}

.node-box:hover {
  border-color: var(--border-active);
}

.node-box.selected {
  border-color: var(--text-secondary);
}

.node-box.editing {
  border-color: var(--text-primary);
}

.node-box.root {
  border-color: var(--text-secondary);
}

.node-text {
  color: var(--text-primary);
  line-height: 1.4;
  flex: 1;
  word-break: break-all;
  pointer-events: none;
}

.node-input {
  border: none;
  outline: none;
  flex: 1;
  background: transparent;
  color: var(--text-primary);
  font-family: "Noto Sans JP", sans-serif;
  line-height: 1.4;
}

/* ── ＋ボタン（角型・最小限） ── */
.add-btn {
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 0;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.1s, border-color 0.1s, color 0.1s;
  padding: 0;
}

.node:hover .add-btn {
  opacity: 1;
}

.add-btn:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
}
</style>
