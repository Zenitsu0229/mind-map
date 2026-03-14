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
      <span class="dot" :style="dotStyle"></span>

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

const depthColors = ['#8b80f8', '#4ecca3', '#f0a060', '#60b8f0', '#e07898', '#a0d868']

const depthColor = computed(() =>
  depthColors[(props.node.parentId === null ? 0 : props.node.depth) % depthColors.length]
)

const nodePositionStyle = computed(() => ({
  left: `${props.node.x - NODE_W / 2}px`,
  top:  `${props.node.y - NODE_H / 2}px`,
}))

const nodeBoxStyle = computed(() => ({
  '--node-accent': depthColor.value,
}))

const dotStyle = computed(() => ({
  background: depthColor.value,
  width:  props.node.parentId === null ? '9px' : '6px',
  height: props.node.parentId === null ? '9px' : '6px',
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

/* ── ベースボックス：下線のみ ── */
.node-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px 8px;
  min-height: v-bind('NODE_H + "px"');
  border-bottom: 1.5px solid color-mix(in srgb, var(--node-accent) 30%, transparent);
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s;
}

/* 丸ぽち */
.dot {
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.15s, box-shadow 0.15s;
}

.node-box:hover {
  border-bottom-color: color-mix(in srgb, var(--node-accent) 65%, transparent);
}

.node-box:hover .dot {
  transform: scale(1.25);
  box-shadow: 0 0 6px var(--node-accent);
}

.node-box.selected {
  border-bottom-color: var(--node-accent);
}

.node-box.selected .dot {
  transform: scale(1.3);
  box-shadow: 0 0 8px var(--node-accent);
}

.node-box.editing {
  border-bottom-color: var(--warn);
}

.node-box.editing .dot {
  background: var(--warn) !important;
}

.node-box.root {
  border-bottom-width: 2px;
}

.node-text {
  color: var(--text-primary);
  line-height: 1.4;
  flex: 1;
  word-break: break-all;
  pointer-events: none;
  opacity: 0.88;
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

/* ── ＋ボタン ── */
.add-btn {
  position: absolute;
  right: -28px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--border-active);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
  padding: 0;
}

.node:hover .add-btn {
  opacity: 1;
}

.add-btn:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
