<template>
  <div class="toolbar">
    <button class="toolbar-btn" title="新規マップ" @click="emit('restart')">
      新規
    </button>

    <div class="divider"></div>

    <button class="toolbar-btn" title="JSONエクスポート" @click="store.exportJSON()">
      エクスポート
    </button>
    <button class="toolbar-btn" title="JSONインポート" @click="triggerImport">
      インポート
    </button>
    <input
      ref="importInputRef"
      type="file"
      accept="application/json,.json"
      style="display: none"
      @change="onImportFile"
    />

    <div class="divider"></div>

    <button
      class="toolbar-btn"
      title="元に戻す (Ctrl+Z)"
      :disabled="!store.history.canUndo()"
      @click="store.undo()"
    >
      Undo
    </button>
    <button
      class="toolbar-btn"
      title="やり直し (Ctrl+Y)"
      :disabled="!store.history.canRedo()"
      @click="store.redo()"
    >
      Redo
    </button>

    <div class="divider"></div>

    <button class="toolbar-btn" title="画面リセット" @click="emit('reset-view')">
      画面リセット
    </button>

    <div class="divider"></div>

    <button
      class="toolbar-btn icon-btn"
      :title="store.theme === 'light' ? 'ダークモードへ' : 'ライトモードへ'"
      @click="store.toggleTheme()"
    >
      {{ store.theme === 'light' ? '🌙' : '☀️' }}
    </button>

    <button
      class="toolbar-btn icon-btn"
      :class="{ active: showShortcuts }"
      title="ショートカット一覧 (?)"
      @click="emit('toggle-shortcuts')"
    >
      ?
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMindMapStore } from '../stores/mindmapStore'

const store = useMindMapStore()
const importInputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  (e: 'reset-view'): void
  (e: 'restart'): void
  (e: 'toggle-shortcuts'): void
}>()

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
    const text = e.target?.result as string
    store.importJSON(text)
  }
  reader.readAsText(file)

  // 同じファイルを再度選択できるようにリセット
  input.value = ''
}
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 100;
  background: var(--toolbar-bg);
  border: 1.5px solid var(--toolbar-border);
  border-radius: 12px;
  padding: 6px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.toolbar-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;
  cursor: pointer;
  color: var(--toolbar-text);
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--toolbar-btn-hover);
  border-color: var(--toolbar-border);
}

.toolbar-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar-btn.icon-btn {
  padding: 6px 10px;
  font-size: 15px;
  min-width: 32px;
  text-align: center;
}

.toolbar-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.divider {
  width: 1px;
  height: 20px;
  background: var(--toolbar-border);
  margin: 0 2px;
}
</style>
