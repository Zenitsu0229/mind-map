<template>
  <aside class="toolbar">
    <div class="toolbar-brand">
      <div class="brand-icon">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="7" width="6" height="4" rx="1.5" fill="currentColor"/>
          <rect x="11" y="2" width="6" height="4" rx="1.5" fill="currentColor" opacity="0.7"/>
          <rect x="11" y="7" width="6" height="4" rx="1.5" fill="currentColor"/>
          <rect x="11" y="12" width="6" height="4" rx="1.5" fill="currentColor" opacity="0.7"/>
          <line x1="7" y1="9" x2="11" y2="4" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
          <line x1="7" y1="9" x2="11" y2="9" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
          <line x1="7" y1="9" x2="11" y2="14" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
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
  border-radius: 8px;
  padding: 14px 8px 10px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

/* ブランド */
.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 6px 10px;
}

.brand-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border-radius: 5px;
  color: #fff;
  flex-shrink: 0;
}

.brand-name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--toolbar-text);
}

/* セクションラベル */
.section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  padding: 0 10px 3px;
  opacity: 0.7;
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
  border-radius: 3px;
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
  border-radius: 5px;
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
  color: var(--accent);
}

.toolbar-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.toolbar-btn.icon-only {
  width: auto;
  padding: 5px 9px;
  font-size: 13px;
}

.toolbar-btn.danger {
  color: #f87171;
}

.toolbar-btn.danger:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.08);
  border-color: #f87171;
  color: #f87171;
}

.toolbar-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.icon {
  font-size: 12px;
  width: 14px;
  text-align: center;
  opacity: 0.7;
  flex-shrink: 0;
}

.label {
  opacity: 0.85;
}
</style>
