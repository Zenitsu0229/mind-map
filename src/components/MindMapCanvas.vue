<template>
  <div
    class="canvas"
    :class="{ panning: isPanning }"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel.prevent="onWheel"
  >
    <!-- Pan & zoom world -->
    <div class="world" :style="worldStyle">
      <!-- Connection lines -->
      <svg class="lines">
        <path
          v-for="link in mindMap.links.value"
          :key="link.id"
          :d="mindMap.linkPath(link)"
          fill="none"
          stroke="#3498db"
          stroke-width="2"
          opacity="0.5"
          stroke-linecap="round"
        />
      </svg>

      <!-- Nodes -->
      <MindNode
        v-for="node in mindMap.nodes.value"
        :key="node.id"
        :node="node"
        @mousedown.stop
      />
    </div>

    <!-- Usage hint -->
    <p class="hint">ドラッグ：移動　ホイール：ズーム　ノードをダブルクリック：編集</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import MindNode from './MindNode.vue'

const mindMap          = inject('mindMap')
const resetViewTrigger = inject('resetViewTrigger')

// ── Pan & zoom state ─────────────────────────────────────────────────────────
const pan       = ref({ x: 0, y: 0 })
const zoom      = ref(1)
const isPanning = ref(false)
let   panStart  = null

const worldStyle = computed(() => ({
  transform:       `translate(${pan.value.x}px, ${pan.value.y}px) scale(${zoom.value})`,
  transformOrigin: '0 0',
}))

// Reset view when triggered from Toolbar via App.vue
watch(resetViewTrigger, () => {
  pan.value  = { x: 0, y: 0 }
  zoom.value = 1
})

// ── Pan handlers ─────────────────────────────────────────────────────────────
function onMouseDown(e) {
  if (e.button !== 0) return
  isPanning.value = true
  panStart = { mx: e.clientX, my: e.clientY, px: pan.value.x, py: pan.value.y }
}

function onMouseMove(e) {
  if (!isPanning.value || !panStart) return
  pan.value = {
    x: panStart.px + (e.clientX - panStart.mx),
    y: panStart.py + (e.clientY - panStart.my),
  }
}

function onMouseUp() {
  isPanning.value = false
  panStart = null
}

// ── Zoom handler ─────────────────────────────────────────────────────────────
function onWheel(e) {
  const factor = e.deltaY > 0 ? 0.9 : 1.1
  const newZ   = Math.min(3, Math.max(0.2, zoom.value * factor))

  const rect = e.currentTarget.getBoundingClientRect()
  const mx   = e.clientX - rect.left
  const my   = e.clientY - rect.top

  pan.value = {
    x: mx - (mx - pan.value.x) * (newZ / zoom.value),
    y: my - (my - pan.value.y) * (newZ / zoom.value),
  }
  zoom.value = newZ
}
</script>

<style scoped>
.canvas {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  cursor: grab;
}

.canvas.panning {
  cursor: grabbing;
}

.world {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.lines {
  position: absolute;
  overflow: visible;
  pointer-events: none;
}

.hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #aaa;
  pointer-events: none;
  white-space: nowrap;
}
</style>
