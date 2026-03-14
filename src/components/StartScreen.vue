<template>
  <div class="start-screen">
    <div class="start-card">
      <div class="logo-mark"></div>
      <h1>Mind Map</h1>
      <p class="sub">最初のトピックを入力してください</p>

      <input
        v-model="text"
        class="topic-input"
        placeholder="例：プロジェクト計画"
        @keyup.enter="submit"
        autofocus
      />

      <div class="btn-group">
        <button class="btn-primary" @click="submit">新規作成</button>
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
  align-items: flex-start;
  gap: 14px;
  padding: 44px 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  min-width: 380px;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent);
  opacity: 0.85;
  margin-bottom: 4px;
}

h1 {
  font-size: 1.9rem;
  color: var(--start-title);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.sub {
  color: var(--start-sub);
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}

.topic-input {
  padding: 11px 14px;
  width: 100%;
  border: 1px solid var(--start-input-border);
  border-radius: 9px;
  font-size: 14px;
  font-family: var(--font-family);
  outline: none;
  background: var(--start-input-bg);
  color: var(--start-input-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-top: 6px;
}

.topic-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
}

.btn-primary {
  padding: 11px 0;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  width: 100%;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.btn-primary:hover {
  opacity: 0.88;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  padding: 10px 0;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 9px;
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, transform 0.1s;
  width: 100%;
  letter-spacing: 0.02em;
}

.btn-secondary:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
}

.btn-secondary:active {
  transform: scale(0.98);
}
</style>
