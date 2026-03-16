<template>
  <div class="start-screen">
    <div class="start-card">
      <div class="brand">
        <div class="brand-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28), 0 1px 0 rgba(255,255,255,0.03) inset;
  min-width: 400px;
  max-width: 440px;
}

/* ブランド */
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 2px;
}

.brand-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border-radius: 6px;
  color: #fff;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  text-transform: uppercase;
}

.card-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0 8px;
}

h1 {
  font-size: 1.25rem;
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
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.topic-input {
  padding: 10px 12px;
  width: 100%;
  border: 1px solid var(--start-input-border);
  border-radius: 5px;
  font-size: 14px;
  font-family: var(--font-family);
  outline: none;
  background: var(--start-input-bg);
  color: var(--start-input-text);
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

.topic-input:hover {
  border-color: var(--border-active);
  background: var(--surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.topic-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
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
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.15s, box-shadow 0.15s;
  width: 100%;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.btn-icon {
  font-size: 16px;
  line-height: 1;
  opacity: 0.85;
}

.btn-primary:hover {
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
}

.btn-primary:active {
  opacity: 1;
  box-shadow: none;
}

.btn-secondary {
  padding: 9px 0;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 5px;
  font-size: 12px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  width: 100%;
  letter-spacing: 0.02em;
}

.btn-secondary:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
  background: var(--surface-raised);
}
</style>
