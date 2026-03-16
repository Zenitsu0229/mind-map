<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="card">
      <div class="card-header">
        <h2>キーボードショートカット</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="shortcut-list">
        <div class="section-title">ノード操作</div>
        <div class="shortcut-row">
          <kbd>Tab</kbd>
          <span>子ノードを追加</span>
        </div>
        <div class="shortcut-row">
          <kbd>Enter</kbd>
          <span>兄弟ノードを追加</span>
        </div>
        <div class="shortcut-row">
          <kbd>Delete</kbd> / <kbd>Backspace</kbd>
          <span>ノードを削除</span>
        </div>
        <div class="shortcut-row">
          <kbd>F2</kbd>
          <span>編集モード開始</span>
        </div>
        <div class="shortcut-row">
          <kbd>Escape</kbd>
          <span>編集終了 / 選択解除</span>
        </div>

        <div class="section-title">ナビゲーション</div>
        <div class="shortcut-row">
          <kbd>↑</kbd> <kbd>↓</kbd>
          <span>兄弟ノードへ移動</span>
        </div>
        <div class="shortcut-row">
          <kbd>←</kbd>
          <span>親ノードへ移動</span>
        </div>
        <div class="shortcut-row">
          <kbd>→</kbd>
          <span>子ノードへ移動</span>
        </div>

        <div class="section-title">編集履歴</div>
        <div class="shortcut-row">
          <kbd>Ctrl</kbd> + <kbd>Z</kbd>
          <span>元に戻す</span>
        </div>
        <div class="shortcut-row">
          <kbd>Ctrl</kbd> + <kbd>Y</kbd>
          <span>やり直し</span>
        </div>

        <div class="section-title">その他</div>
        <div class="shortcut-row">
          <kbd>?</kbd>
          <span>このパネルを開閉</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => { window.addEventListener('keydown', onKeydown) })
onUnmounted(() => { window.removeEventListener('keydown', onKeydown) })
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
}

.card {
  background: var(--overlay-card-bg);
  color: var(--overlay-card-text);
  border: 1px solid var(--border);
  border-radius: 0;
  padding: 24px 28px;
  min-width: 380px;
  max-width: 500px;
  box-shadow: 4px 4px 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: 1px solid transparent;
  font-size: 1rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s;
  padding: 4px 8px;
  border-radius: 0;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--toolbar-btn-hover);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-top: 14px;
  margin-bottom: 4px;
  opacity: 0.85;
}

.section-title:first-child {
  margin-top: 0;
}

.shortcut-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  padding: 3px 0;
  color: var(--text-secondary);
}

.shortcut-row span {
  margin-left: auto;
  color: var(--text-secondary);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  background: var(--surface-raised);
  border: 1px solid var(--border-active);
  border-radius: 0;
  font-size: 0.76rem;
  font-family: "Noto Sans JP", monospace;
  white-space: nowrap;
  min-width: 26px;
  color: var(--text-primary);
}
</style>
