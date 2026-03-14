<template>
  <div :data-theme="store.theme">
    <StartScreen v-if="!started" @start="handleStart" @continue="handleContinue" />

    <template v-else>
      <MindMapCanvas ref="canvasRef" />
      <Toolbar
        @reset-view="onResetView"
        @restart="handleRestart"
        :show-shortcuts="showShortcuts"
        @toggle-shortcuts="showShortcuts = !showShortcuts"
      />
      <ShortcutOverlay v-if="showShortcuts" @close="showShortcuts = false" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMindMapStore } from './stores/mindmapStore'
import StartScreen from './components/StartScreen.vue'
import MindMapCanvas from './components/MindMapCanvas.vue'
import Toolbar from './components/Toolbar.vue'
import ShortcutOverlay from './components/ShortcutOverlay.vue'

const store = useMindMapStore()
const started = ref(false)
const showShortcuts = ref(false)
const canvasRef = ref<InstanceType<typeof MindMapCanvas> | null>(null)

function handleStart(text: string): void {
  store.initMap(text)
  started.value = true
}

function handleContinue(): void {
  store.loadFromSaved()
  started.value = true
}

function handleRestart(): void {
  store.resetMap()
  started.value = false
}

function onResetView(): void {
  canvasRef.value?.resetView()
}

// テーマ変更をdocumentに反映
watch(
  () => store.theme,
  (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    document.documentElement.style.colorScheme = newTheme
  },
  { immediate: true }
)
</script>
