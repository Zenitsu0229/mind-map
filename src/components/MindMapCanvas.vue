<template>
  <div
    class="canvas"
    :class="{ panning: canvas.isPanning.value }"
    @mousedown="onCanvasMouseDown"
    @mousemove="canvas.onMouseMove"
    @mouseup="canvas.onMouseUp"
    @mouseleave="canvas.onMouseUp"
    @wheel.prevent="canvas.onWheel"
    @click="onCanvasClick"
  >
    <!-- Pan & zoom world (原点は画面左上、transformで中央に移動済み) -->
    <div class="world" :style="canvas.worldStyle.value">
      <!-- Connection lines SVG -->
      <svg class="lines">
        <path
          v-for="link in store.allLinks"
          :key="link.id"
          :d="getLinkPath(link)"
          fill="none"
          :stroke="getDepthColor(link.depth)"
          stroke-width="2"
          opacity="0.6"
          stroke-linecap="round"
        />
      </svg>

      <!-- Nodes -->
      <MindNode
        v-for="node in store.allNodes"
        :key="node.id"
        :node="node"
      />
    </div>

    <!-- Usage hint -->
    <p class="hint">
      ドラッグ：移動　ホイール：ズーム　ダブルクリック：編集　Tab：子追加　Enter：兄弟追加　?：ショートカット
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import MindNode from './MindNode.vue'
import { useMindMapStore } from '../stores/mindmapStore'
import { useCanvas } from '../composables/useCanvas'
import type { LinkInfo } from '../types'
import { NODE_W, NODE_H } from '../composables/useLayout'

const store = useMindMapStore()
const canvas = useCanvas()

const colorPalette = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']

function getDepthColor(depth: number): string {
  return colorPalette[depth % colorPalette.length]
}

function getLinkPath(link: LinkInfo): string {
  const parent = store.allNodes.find(n => n.id === link.parentId)
  const child = store.allNodes.find(n => n.id === link.childId)
  if (!parent || !child) return ''

  const px = parent.x
  const py = parent.y
  const cx = child.x
  const cy = child.y
  const mx = (px + cx) / 2

  return `M${px},${py} C${mx},${py} ${mx},${cy} ${cx},${cy}`
}

function onCanvasMouseDown(e: MouseEvent): void {
  // ノードをクリックした場合はパンしない（.stopで止める）
  canvas.onMouseDown(e)
}

function onCanvasClick(e: MouseEvent): void {
  // キャンバス自体をクリックしたら選択解除
  const target = e.target as HTMLElement
  if (target.classList.contains('canvas') || target.classList.contains('world')) {
    store.selectNode(null)
  }
}

// 初期表示時に画面中央にリセット
onMounted(() => {
  resetView()
})

function resetView(): void {
  canvas.resetView(window.innerWidth, window.innerHeight)
}

defineExpose({ resetView })
</script>

<style scoped>
.canvas {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  cursor: grab;
  background: var(--bg);
  transition: background 0.3s ease;
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
  font-size: 11px;
  color: var(--hint-color);
  pointer-events: none;
  white-space: nowrap;
  font-family: "Noto Sans JP", sans-serif;
}
</style>
