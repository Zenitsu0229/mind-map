<template>
  <div class="toolbar">
    <button @click="emit('reset-view')">画面リセット</button>
    <button @click="emit('restart')">最初からやり直す</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['reset-view', 'restart'])
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 100;
}

button {
  padding: 7px 14px;
  background: white;
  border: 1.5px solid #c8d6e5;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  color: #2c3e50;
  transition: background 0.15s;
}

button:hover {
  background: #f0f4f8;
}
</style>
