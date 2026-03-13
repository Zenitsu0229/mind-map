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
          <span>元に戻す (Undo)</span>
        </div>
        <div class="shortcut-row">
          <kbd>Ctrl</kbd> + <kbd>Y</kbd>
          <span>やり直し (Redo)</span>
        </div>

        <div class="section-title">その他</div>
        <div class="shortcut-row">
          <kbd>?</kbd>
          <span>このオーバーレイを表示/非表示</span>
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
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
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
  backdrop-filter: blur(4px);
}

.card {
  background: var(--overlay-card-bg);
  color: var(--overlay-card-text);
  border-radius: 16px;
  padding: 28px 32px;
  min-width: 420px;
  max-width: 560px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--overlay-card-text);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 4px 8px;
  border-radius: 6px;
}

.close-btn:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.15);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #3498db;
  margin-top: 12px;
  margin-bottom: 4px;
}

.section-title:first-child {
  margin-top: 0;
}

.shortcut-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  padding: 4px 0;
}

.shortcut-row span {
  margin-left: auto;
  color: var(--overlay-card-text);
  opacity: 0.8;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  background: rgba(128, 128, 128, 0.12);
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 5px;
  font-size: 0.82rem;
  font-family: "Noto Sans JP", monospace;
  white-space: nowrap;
  min-width: 28px;
}
</style>
