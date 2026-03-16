<template>
  <div class="start-screen">
    <div class="start-card">
      <div class="brand">
        <div class="brand-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

      <div class="card-divider"></div>

      <h1>新しいマップを作成</h1>
      <p class="sub">中心トピックを入力してください</p>

      <div class="field">
        <label class="field-label" for="topic-input">トピック名</label>
        <input
          id="topic-input"
          v-model="text"
          class="topic-input"
          placeholder="例：プロジェクト計画"
          @keyup.enter="submit"
          autofocus
        />
      </div>

      <div class="btn-group">
        <button class="btn-primary" @click="submit">
          <span class="btn-icon">+</span>
          新規作成
        </button>
        <button
          v-if="hasSaved"
          class="btn-secondary"
          @click="emit('continue')"
        >
          前回の続きから始める
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hasStoredData } from '../utils/storage'

const emit = defineEmits<{
  (e: 'start', text: string): void
  (e: 'continue'): void
}>()

const text = ref('')
const hasSaved = ref(false)

onMounted(() => {
  hasSaved.value = hasStoredData()
})

function submit(): void {
  if (!text.value.trim()) return
  emit('start', text.value.trim())
}
</script>

<style scoped>
.start-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--bg);
}

.start-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 36px 36px 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0;
  box-shadow: 4px 4px 0 rgba(255, 255, 255, 0.04), 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 400px;
  max-width: 440px;
}

[data-theme="light"] .start-card {
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* ブランド */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}

.brand-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-primary);
  border-radius: 0;
  color: var(--bg);
  flex-shrink: 0;
}

.brand-name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.card-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0 8px;
}

h1 {
  font-size: 1.2rem;
  color: var(--start-title);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.sub {
  color: var(--start-sub);
  font-size: 0.8rem;
  margin-top: -4px;
  margin-bottom: 6px;
}

/* フィールド */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.topic-input {
  padding: 10px 12px;
  width: 100%;
  border: 1px solid var(--start-input-border);
  border-radius: 0;
  font-size: 14px;
  font-family: var(--font-family);
  outline: none;
  background: var(--start-input-bg);
  color: var(--start-input-text);
  transition: border-color 0.12s, box-shadow 0.12s, background 0.12s;
}

.topic-input:hover {
  border-color: var(--border-active);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--border-active);
}

.topic-input:focus {
  border-color: var(--text-primary);
  box-shadow: inset 0 0 0 1px var(--text-primary);
  background: var(--surface);
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  background: var(--text-primary);
  color: var(--bg);
  border: 1px solid var(--text-primary);
  border-radius: 0;
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.12s;
  width: 100%;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.btn-icon {
  font-size: 16px;
  line-height: 1;
}

.btn-primary:hover {
  opacity: 0.82;
}

.btn-secondary {
  padding: 9px 0;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 0;
  font-size: 12px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: border-color 0.12s, color 0.12s;
  width: 100%;
  letter-spacing: 0.02em;
}

.btn-secondary:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
}
</style>
