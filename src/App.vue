<template>
  <div :data-theme="store.theme">
    <StartScreen
      v-if="!started"
      @start="handleStart"
      @continue="handleContinue"
      @open-contact="showContact = true"
      @open-terms="openLegal('terms')"
      @open-privacy="openLegal('privacy')"
      @open-cookie="openLegal('cookie')"
    />

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

    <ContactModal v-if="showContact" @close="showContact = false" />
    <LegalModal v-if="legalType" :type="legalType" @close="legalType = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useMindMapStore } from './stores/mindmapStore'
import { hasStoredData } from './utils/storage'
import StartScreen from './components/StartScreen.vue'
import MindMapCanvas from './components/MindMapCanvas.vue'
import Toolbar from './components/Toolbar.vue'
import ShortcutOverlay from './components/ShortcutOverlay.vue'
import ContactModal from './components/ContactModal.vue'
import LegalModal from './components/LegalModal.vue'

type LegalType = 'terms' | 'privacy' | 'cookie'

const store = useMindMapStore()
const started = ref(false)
const showShortcuts = ref(false)
const showContact = ref(false)
const legalType = ref<LegalType | null>(null)
const canvasRef = ref<InstanceType<typeof MindMapCanvas> | null>(null)

function openLegal(type: LegalType): void {
  legalType.value = type
}

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

// ブラウザの戻る/進む → undo/redo
function onPopState(e: PopStateEvent): void {
  if (!started.value) return
  const newSerial: number = (e.state as { mms?: number } | null)?.mms ?? 0
  const curSerial = store.browserSerial
  if (newSerial < curSerial) {
    store.undo()
  } else if (newSerial > curSerial) {
    store.redo()
  }
  store.setBrowserSerial(newSerial)
}

onMounted(() => {
  // 保存データがあればリロード後もマップ画面を維持
  if (hasStoredData()) {
    handleContinue()
  }

  // ブラウザ履歴の初期状態を設定
  window.history.replaceState({ mms: 0 }, '')

  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState)
})

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
