<template>
  <aside class="toolbar">
    <div class="toolbar-title">
      <span class="title-dot"></span>
      Mind Map
    </div>

    <div class="ops-list">
      <div class="op-row"><kbd>ドラッグ</kbd><span>移動</span></div>
      <div class="op-row"><kbd>ホイール</kbd><span>ズーム</span></div>
      <div class="op-row"><kbd>Tab</kbd><span>子ノード追加</span></div>
      <div class="op-row"><kbd>Enter</kbd><span>兄弟追加</span></div>
      <div class="op-row"><kbd>Del</kbd><span>削除</span></div>
      <div class="op-row"><kbd>F2</kbd><span>編集</span></div>
      <div class="op-row"><kbd>↑↓</kbd><span>兄弟移動</span></div>
      <div class="op-row"><kbd>←→</kbd><span>親子移動</span></div>
    </div>

    <div class="divider"></div>

    <div class="toolbar-section">
      <button class="toolbar-btn" title="画像エクスポート (JPEG)" @click="onExportImage" :disabled="exporting">
        <span class="icon">{{ exporting ? '…' : '🖼' }}</span>
        <span class="label">{{ exporting ? '処理中' : '画像保存' }}</span>
      </button>
      <button class="toolbar-btn" title="JSONエクスポート" @click="store.exportJSON()">
        <span class="icon">↑</span>
        <span class="label">JSON保存</span>
      </button>
      <button class="toolbar-btn" title="JSONインポート" @click="triggerImport">
        <span class="icon">↓</span>
        <span class="label">インポート</span>
      </button>
      <input
        ref="importInputRef"
        type="file"
        accept="application/json,.json"
        style="display: none"
        @change="onImportFile"
      />
    </div>

    <div class="divider"></div>

    <div class="toolbar-section">
      <button
        class="toolbar-btn"
        title="元に戻す (Ctrl+Z)"
        :disabled="!store.history.canUndo()"
        @click="store.undo()"
      >
        <span class="icon">↺</span>
        <span class="label">Undo</span>
      </button>
      <button
        class="toolbar-btn"
        title="やり直し (Ctrl+Y)"
        :disabled="!store.history.canRedo()"
        @click="store.redo()"
      >
        <span class="icon">↻</span>
        <span class="label">Redo</span>
      </button>
    </div>

    <div class="divider"></div>

    <div class="toolbar-section">
      <button class="toolbar-btn" title="画面位置をリセット" @click="emit('reset-view')">
        <span class="icon">⊙</span>
        <span class="label">表示リセット</span>
      </button>
      <button class="toolbar-btn danger" title="マップを全リセット" @click="onFullReset">
        <span class="icon">✕</span>
        <span class="label">全リセット</span>
      </button>
    </div>

    <div class="spacer"></div>

    <div class="toolbar-section toolbar-footer">
      <button
        class="toolbar-btn icon-only"
        :class="{ active: showShortcuts }"
        title="ショートカット (?)"
        @click="emit('toggle-shortcuts')"
      >
        ?
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMindMapStore } from '../stores/mindmapStore'
import { exportAsJpeg } from '../utils/exportImage'

const store = useMindMapStore()
const importInputRef = ref<HTMLInputElement | null>(null)
const exporting = ref(false)

async function onExportImage(): Promise<void> {
  exporting.value = true
  try {
    await exportAsJpeg()
  } finally {
    exporting.value = false
  }
}

const emit = defineEmits<{
  (e: 'reset-view'): void
  (e: 'restart'): void
  (e: 'toggle-shortcuts'): void
}>()

function onFullReset(): void {
  if (confirm('マップをすべてリセットしますか？\nこの操作は元に戻せません。')) {
    emit('restart')
  }
}

defineProps<{
  showShortcuts: boolean
}>()

function triggerImport(): void {
  importInputRef.value?.click()
}

function onImportFile(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    store.importJSON(e.target?.result as string)
  }
  reader.readAsText(file)
  input.value = ''
}
</script>

<style scoped>
.toolbar {
  position: fixed;
  left: 16px;
  top: 16px;
  bottom: 16px;
  width: 148px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
  background: var(--toolbar-bg);
  border: 1px solid var(--toolbar-border);
  border-radius: 14px;
  padding: 16px 8px 10px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.ops-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 6px 8px 4px;
}

.op-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-secondary);
  gap: 4px;
}

.op-row span {
  opacity: 0.7;
  letter-spacing: 0.01em;
}

.op-row kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 5px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 9px;
  font-family: "Noto Sans JP", monospace;
  color: var(--text-primary);
  min-width: 28px;
  white-space: nowrap;
  flex-shrink: 0;
}

.toolbar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  opacity: 0.9;
}

.title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.toolbar-footer {
  flex-direction: row;
  justify-content: flex-end;
}

.spacer {
  flex: 1;
}

.divider {
  height: 1px;
  background: var(--toolbar-border);
  margin: 6px 4px;
  opacity: 0.6;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 12px;
  font-family: "Noto Sans JP", sans-serif;
  cursor: pointer;
  color: var(--toolbar-text);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--toolbar-btn-hover);
  border-color: var(--border-active);
  color: var(--accent);
}

.toolbar-btn:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

.toolbar-btn.icon-only {
  width: auto;
  padding: 7px 10px;
  font-size: 13px;
}

.toolbar-btn.danger {
  color: #e06060;
}

.toolbar-btn.danger:hover:not(:disabled) {
  background: rgba(224, 96, 96, 0.1);
  border-color: #e06060;
  color: #e06060;
}

.toolbar-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
  opacity: 0.7;
  flex-shrink: 0;
}

.label {
  opacity: 0.85;
}
</style>
