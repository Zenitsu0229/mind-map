import { ref } from 'vue'
import type { MindNode } from '../types'

const MAX_HISTORY = 50

export function useHistory() {
  const past = ref<string[]>([])
  const future = ref<string[]>([])

  function snapshot(root: MindNode | null): void {
    if (!root) return
    const serialized = JSON.stringify(root)
    past.value.push(serialized)
    if (past.value.length > MAX_HISTORY) {
      past.value.shift()
    }
    // 新しいアクションが発生したら未来をクリア
    future.value = []
  }

  function undo(currentRoot: MindNode | null): MindNode | null {
    if (past.value.length === 0) return currentRoot
    const prev = past.value.pop()!
    if (currentRoot) {
      future.value.push(JSON.stringify(currentRoot))
    }
    return JSON.parse(prev) as MindNode
  }

  function redo(currentRoot: MindNode | null): MindNode | null {
    if (future.value.length === 0) return currentRoot
    const next = future.value.pop()!
    if (currentRoot) {
      past.value.push(JSON.stringify(currentRoot))
    }
    return JSON.parse(next) as MindNode
  }

  function clear(): void {
    past.value = []
    future.value = []
  }

  const canUndo = () => past.value.length > 0
  const canRedo = () => future.value.length > 0

  return {
    past,
    future,
    snapshot,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  }
}
