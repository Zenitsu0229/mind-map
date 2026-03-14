import { ref, computed } from 'vue'
import { NODE_W, NODE_H } from './useLayout'

export function useCanvas() {
  const panX = ref(0)
  const panY = ref(0)
  const zoom = ref(1)
  const isPanning = ref(false)

  let panStart: { mx: number; my: number; px: number; py: number } | null = null

  const worldStyle = computed(() => ({
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
    transformOrigin: '0 0',
  }))

  function onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return
    isPanning.value = true
    panStart = { mx: e.clientX, my: e.clientY, px: panX.value, py: panY.value }
  }

  function onMouseMove(e: MouseEvent): void {
    if (!isPanning.value || !panStart) return
    panX.value = panStart.px + (e.clientX - panStart.mx)
    panY.value = panStart.py + (e.clientY - panStart.my)
  }

  function onMouseUp(): void {
    isPanning.value = false
    panStart = null
  }

  function onWheel(e: WheelEvent): void {
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    const newZ = Math.min(3, Math.max(0.2, zoom.value * factor))

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    panX.value = mx - (mx - panX.value) * (newZ / zoom.value)
    panY.value = my - (my - panY.value) * (newZ / zoom.value)
    zoom.value = newZ
  }

  function resetView(screenW: number, screenH: number): void {
    // ルートをツールバー右側の左上に配置
    panX.value = NODE_W / 2 + 196
    panY.value = NODE_H / 2 + 60
    zoom.value = 1
  }

  function centerView(screenW: number, screenH: number): void {
    panX.value = screenW / 2
    panY.value = screenH / 2
    zoom.value = 1
  }

  return {
    panX,
    panY,
    zoom,
    isPanning,
    worldStyle,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    resetView,
    centerView,
  }
}
