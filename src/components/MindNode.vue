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

const depthColors = ['#d0d0d0', '#a0a0a0', '#e8e8e8', '#787878', '#c0c0c0', '#909090']

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
  width:  props.node.parentId === null ? '8px' : '6px',
  height: props.node.parentId === null ? '8px' : '6px',
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

/* ── 角型カードノード ── */
.node-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px 6px 8px;
  min-height: v-bind('NODE_H + "px"');
  background: var(--node-bg);
  border: 1px solid var(--node-border);
  border-left: 2px solid var(--node-accent);
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.12s, box-shadow 0.12s;
}

/* 四角ドット */
.dot {
  border-radius: 0;
  flex-shrink: 0;
  transition: transform 0.12s;
}

.node-box:hover {
  border-color: var(--border-active);
  border-left-color: var(--node-accent);
  box-shadow: 2px 2px 0 rgba(255, 255, 255, 0.04);
}

.node-box:hover .dot {
  transform: scale(1.2);
}

.node-box.selected {
  border-color: var(--node-accent);
  box-shadow: 0 0 0 1px var(--node-accent);
}

.node-box.selected .dot {
  transform: scale(1.25);
}

.node-box.editing {
  border-color: var(--text-secondary);
  border-left-color: var(--text-primary);
  box-shadow: 0 0 0 1px var(--text-secondary);
}

.node-box.editing .dot {
  background: var(--text-primary) !important;
}

.node-box.root {
  border-left-width: 3px;
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

/* ── ＋ボタン（角型） ── */
.add-btn {
  position: absolute;
  right: -26px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 0;
  background: var(--surface-raised);
  border: 1px solid var(--border-active);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.12s, background 0.12s, color 0.12s, border-color 0.12s;
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
