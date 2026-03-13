<template>
  <StartScreen v-if="!started" @start="handleStart" />

  <template v-else>
    <MindMapCanvas />
    <Toolbar @reset-view="onResetView" @restart="handleRestart" />
  </template>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useMindMap } from './composables/useMindMap.js'
import StartScreen    from './components/StartScreen.vue'
import MindMapCanvas  from './components/MindMapCanvas.vue'
import Toolbar        from './components/Toolbar.vue'

const started  = ref(false)
const mindMap  = useMindMap()

// Make mindMap available to all descendant components via inject
provide('mindMap', mindMap)

// Expose resetView trigger to MindMapCanvas via provide
const resetViewTrigger = ref(0)
provide('resetViewTrigger', resetViewTrigger)

function handleStart(text) {
  mindMap.startMap(text)
  started.value = true
}

function handleRestart() {
  mindMap.resetMap()
  started.value = false
}

function onResetView() {
  resetViewTrigger.value++
}
</script>
