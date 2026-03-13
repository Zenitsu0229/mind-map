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
      :style="nodeBoxStyle"
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

// ── computed ─────────────────────────────────────────────────────────────────

const isSelected = computed(() => store.selectedId === props.node.id)
const isEditing  = computed(() => store.editingId  === props.node.id)

const depthColor = computed(() => {
  const palette = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']
  if (props.node.parentId === null) return '#2ecc71'
  return palette[props.node.depth % palette.length]
})

const nodePositionStyle = computed(() => ({
  left: `${props.node.x - NODE_W / 2}px`,
  top:  `${props.node.y - NODE_H / 2}px`,
}))

const nodeBoxStyle = computed(() => ({
  borderColor: depthColor.value,
}))

const fontStyle = computed(() => {
  if (props.node.depth === 0) return { fontSize: '18px', fontWeight: '700' }
  if (props.node.depth === 1) return { fontSize: '15px', fontWeight: '500' }
  return { fontSize: '13px', fontWeight: '400' }
})

// ── watchers ─────────────────────────────────────────────────────────────────

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

// ── handlers ─────────────────────────────────────────────────────────────────

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
  /* ノード間でhoverが重なるときのためにz-index調整 */
  z-index: 1;
}

.node:hover { z-index: 2; }

/* ── Node box ── */
.node-box {
  background: var(--node-bg);
  border: 2px solid #3498db;
  border-radius: 10px;
  padding: 8px 12px;
  text-align: center;
  min-height: v-bind('NODE_H + "px"');
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.15s, outline 0.1s, transform 0.1s;
  word-break: break-all;
  cursor: pointer;
  user-select: none;
}

.node-box:hover {
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.22);
  transform: translateY(-1px);
}

/* 選択中 */
.node-box.selected {
  outline: 2.5px solid #3498db;
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.18), 0 4px 16px rgba(52, 152, 219, 0.25);
}

/* ルートノード */
.node-box.root {
  background: var(--node-root-bg);
  border-color: var(--node-root-border);
  box-shadow: 0 4px 20px rgba(46, 204, 113, 0.2);
}

.node-box.root.selected {
  outline-color: #2ecc71;
  box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.2), 0 4px 20px rgba(46, 204, 113, 0.3);
}

/* 編集中 */
.node-box.editing {
  outline: 2.5px solid #f39c12;
  outline-offset: 3px;
}

.node-text {
  color: var(--node-text);
  line-height: 1.4;
  width: 100%;
  word-break: break-all;
  pointer-events: none;
}

.node-input {
  border: none;
  outline: none;
  text-align: center;
  width: 100%;
  background: transparent;
  color: var(--node-text);
  font-family: "Noto Sans JP", sans-serif;
  line-height: 1.4;
}
</style>
