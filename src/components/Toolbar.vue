<template>
  <aside class="toolbar">
    <div class="toolbar-brand">
      <div class="brand-icon">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="0" y="6" width="5" height="4" fill="currentColor"/>
          <rect x="9" y="1" width="7" height="3" fill="currentColor" opacity="0.6"/>
          <rect x="9" y="6" width="7" height="3" fill="currentColor"/>
          <rect x="9" y="11" width="7" height="3" fill="currentColor" opacity="0.6"/>
          <line x1="5" y1="8" x2="9" y2="2.5" stroke="currentColor" stroke-width="1" opacity="0.4"/>
          <line x1="5" y1="8" x2="9" y2="7.5" stroke="currentColor" stroke-width="1" opacity="0.4"/>
          <line x1="5" y1="8" x2="9" y2="12.5" stroke="currentColor" stroke-width="1" opacity="0.4"/>
        </svg>
      </div>
      <span class="brand-name">Mind Map</span>
    </div>

    <div class="divider"></div>

    <div class="ops-list">
      <div class="op-row"><kbd>ドラッグ</kbd><span>移動</span></div>
      <div class="op-row"><kbd>ホイール</kbd><span>ズーム</span></div>
      <div class="op-row"><kbd>Tab</kbd><span>子追加</span></div>
      <div class="op-row"><kbd>Enter</kbd><span>兄弟追加</span></div>
      <div class="op-row"><kbd>Del</kbd><span>削除</span></div>
      <div class="op-row"><kbd>F2</kbd><span>編集</span></div>
    </div>

    <div class="divider"></div>

    <div class="section-label">データ</div>
    <div class="toolbar-section">
      <button class="toolbar-btn" title="画像エクスポート (JPEG)" @click="onExportImage" :disabled="exporting">
        <span class="icon">{{ exporting ? '…' : '↗' }}</span>
        <span class="label">{{ exporting ? '処理中...' : '画像保存' }}</span>
      </button>
      <button class="toolbar-btn" title="JSONエクスポート" @click="store.exportJSON()">
        <span class="icon">↗</span>
        <span class="label">JSON保存</span>
      </button>
      <button class="toolbar-btn" title="JSONインポート" @click="triggerImport">
        <span class="icon">↙</span>
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

    <div class="section-label">履歴</div>
    <div class="toolbar-section">
      <button
        class="toolbar-btn"
        title="元に戻す (Ctrl+Z)"
        :disabled="!store.history.canUndo()"
        @click="store.undo()"
      >
        <span class="icon">↺</span>
        <span class="label">元に戻す</span>
      </button>
      <button
        class="toolbar-btn"
        title="やり直し (Ctrl+Y)"
        :disabled="!store.history.canRedo()"
        @click="store.redo()"
      >
        <span class="icon">↻</span>
        <span class="label">やり直し</span>
      </button>
    </div>

    <div class="divider"></div>

    <div class="section-label">表示</div>
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
  width: 152px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
  background: var(--toolbar-bg);
  border: 1px solid var(--toolbar-border);
  border-radius: 0;
  padding: 14px 8px 10px;
  backdrop-filter: blur(8px);
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.25);
}

/* ブランド */
.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 6px 10px;
}

.brand-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-primary);
  border-radius: 0;
  color: var(--bg);
  flex-shrink: 0;
}

.brand-name {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--toolbar-text);
}

/* セクションラベル */
.section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  padding: 0 10px 3px;
}

.ops-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px 6px 4px;
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
  border-radius: 0;
  font-size: 9px;
  font-family: "Noto Sans JP", monospace;
  color: var(--text-primary);
  min-width: 28px;
  white-space: nowrap;
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
  margin: 5px 4px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0;
  font-size: 11.5px;
  font-family: "Noto Sans JP", sans-serif;
  cursor: pointer;
  color: var(--toolbar-text);
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--toolbar-btn-hover);
  border-color: var(--border-active);
  color: var(--text-primary);
}

.toolbar-btn:disabled {
  opacity: 0.22;
  cursor: not-allowed;
}

.toolbar-btn.icon-only {
  width: auto;
  padding: 5px 9px;
  font-size: 13px;
}

.toolbar-btn.danger {
  color: #808080;
}

.toolbar-btn.danger:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.04);
  border-color: #a0a0a0;
  color: #e0e0e0;
}

.toolbar-btn.active {
  background: var(--accent-dim);
  border-color: var(--border-active);
  color: var(--text-primary);
}

.icon {
  font-size: 12px;
  width: 14px;
  text-align: center;
  opacity: 0.6;
  flex-shrink: 0;
}

.label {
  opacity: 0.85;
}
</style>
