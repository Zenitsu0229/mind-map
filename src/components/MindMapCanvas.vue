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
    <div class="world" :style="canvas.worldStyle.value">
      <svg class="lines">
        <path
          v-for="link in store.allLinks"
          :key="link.id"
          :d="getLinkPath(link)"
          fill="none"
          :stroke="getDepthColor(link.depth)"
          stroke-width="1"
          opacity="0.35"
          stroke-linecap="square"
        />
      </svg>

      <MindNode
        v-for="node in store.allNodes"
        :key="node.id"
        :node="node"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MindNode from './MindNode.vue'
import { useMindMapStore } from '../stores/mindmapStore'
import { useCanvas } from '../composables/useCanvas'
import { useKeyboard } from '../composables/useKeyboard'
import type { LinkInfo } from '../types'
import { NODE_W, NODE_H } from '../composables/useLayout'

const store = useMindMapStore()
const canvas = useCanvas()
useKeyboard()

const depthColors = ['#d0d0d0', '#a0a0a0', '#e8e8e8', '#787878', '#c0c0c0', '#909090']

function getDepthColor(depth: number): string {
  return depthColors[depth % depthColors.length]
}

function getLinkPath(link: LinkInfo): string {
  const parent = store.allNodes.find(n => n.id === link.parentId)
  const child  = store.allNodes.find(n => n.id === link.childId)
  if (!parent || !child) return ''

  // 親：＋ボタンの少し右（NODE_W/2 + ボタン中心18px + 余白5px）
  const px = parent.x + NODE_W / 2 + 23
  const py = parent.y
  // 子：丸ぽちの少し右（-NODE_W/2 + padding4 + dot半径3 + 余白6）
  const cx = child.x - NODE_W / 2 + 13
  const cy = child.y
  const mx = (px + cx) / 2

  return `M${px},${py} C${mx},${py} ${mx},${cy} ${cx},${cy}`
}

function onCanvasMouseDown(e: MouseEvent): void {
  canvas.onMouseDown(e)
}

function onCanvasClick(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (target.classList.contains('canvas') || target.classList.contains('world')) {
    store.selectNode(null)
  }
}

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
</style>
