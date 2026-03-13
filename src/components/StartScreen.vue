<template>
  <div class="start-screen">
    <h1>Mind Map</h1>
    <p>最初のトピックを入力してください</p>
    <input
      v-model="text"
      placeholder="例：プロジェクト計画"
      @keyup.enter="submit"
      autofocus
    />
    <button @click="submit">OK</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start'])
const text = ref('')

function submit() {
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
  gap: 14px;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

input {
  padding: 12px 18px;
  width: 320px;
  border: 2px solid #c8d6e5;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  background: white;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #3498db;
}

button {
  padding: 12px 40px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

button:hover  { background: #2980b9; }
button:active { transform: scale(0.97); }
</style>
