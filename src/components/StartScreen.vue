<template>
  <div class="start-screen">
    <div class="start-card">
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--bg);
  transition: background 0.3s ease;
}

.start-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 40px;
  background: var(--node-bg);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 400px;
}

h1 {
  font-size: 2.2rem;
  color: var(--start-title);
  font-weight: 700;
  letter-spacing: 2px;
}

.sub {
  color: var(--start-sub);
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.topic-input {
  padding: 12px 18px;
  width: 100%;
  border: 2px solid var(--start-input-border);
  border-radius: 10px;
  font-size: 16px;
  font-family: var(--font-family, "Noto Sans JP", sans-serif);
  outline: none;
  background: var(--start-input-bg);
  color: var(--start-input-text);
  transition: border-color 0.2s;
}

.topic-input:focus {
  border-color: #3498db;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.btn-primary {
  padding: 13px 40px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-family: var(--font-family, "Noto Sans JP", sans-serif);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  width: 100%;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-primary:active {
  transform: scale(0.97);
}

.btn-secondary {
  padding: 11px 40px;
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
  border-radius: 10px;
  font-size: 15px;
  font-family: var(--font-family, "Noto Sans JP", sans-serif);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  width: 100%;
}

.btn-secondary:hover {
  background: #3498db;
  color: white;
}

.btn-secondary:active {
  transform: scale(0.97);
}
</style>
