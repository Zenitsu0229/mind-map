import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MindNode, LinkInfo } from '../types'
import { calcLayout } from '../composables/useLayout'
import { useHistory } from '../composables/useHistory'
import { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage'

let nextIdCounter = 1

function generateId(): string {
  return `node-${nextIdCounter++}`
}

function findNode(root: MindNode | null, id: string): MindNode | null {
  if (!root) return null
  if (root.id === id) return root
  for (const child of root.children) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

function findParent(root: MindNode | null, id: string): MindNode | null {
  if (!root) return null
  for (const child of root.children) {
    if (child.id === id) return root
    const found = findParent(child, id)
    if (found) return found
  }
  return null
}

function flattenTree(node: MindNode, result: MindNode[] = []): MindNode[] {
  result.push(node)
  for (const child of node.children) {
    flattenTree(child, result)
  }
  return result
}

function collectLinks(node: MindNode, result: LinkInfo[] = []): LinkInfo[] {
  for (const child of node.children) {
    result.push({
      id: `${node.id}-${child.id}`,
      parentId: node.id,
      childId: child.id,
      depth: child.depth,
    })
    collectLinks(child, result)
  }
  return result
}

export const useMindMapStore = defineStore('mindmap', () => {
  const root = ref<MindNode | null>(null)
  const selectedId = ref<string | null>(null)
  const editingId = ref<string | null>(null)
  const theme = ref<'light' | 'dark'>('dark')

  const history = useHistory()

  // ── computed ────────────────────────────────────────────────────────────────

  const allNodes = computed<MindNode[]>(() => {
    if (!root.value) return []
    return flattenTree(root.value)
  })

  const allLinks = computed<LinkInfo[]>(() => {
    if (!root.value) return []
    return collectLinks(root.value)
  })

  // ── helpers ─────────────────────────────────────────────────────────────────

  function applyLayout(): void {
    if (root.value) {
      calcLayout(root.value)
      saveToStorage(root.value)
    }
  }

  function takeSnapshot(): void {
    history.snapshot(root.value)
  }

  // ── actions ─────────────────────────────────────────────────────────────────

  function initMap(text: string): void {
    nextIdCounter = 1
    root.value = {
      id: generateId(),
      text,
      children: [],
      collapsed: false,
      parentId: null,
      direction: null,
      x: 0,
      y: 0,
      depth: 0,
    }
    selectedId.value = root.value.id
    editingId.value = null
    history.clear()
    applyLayout()
  }

  function resetMap(): void {
    root.value = null
    selectedId.value = null
    editingId.value = null
    history.clear()
    clearStorage()
  }

  function addChild(parentId: string): void {
    const parent = findNode(root.value, parentId)
    if (!parent) return

    takeSnapshot()

    // 方向を自動決定:
    //   - ルート直下 → 追加後の子数が奇数なら右、偶数なら左（右から始まる交互配置）
    //   - それ以外   → 親と同じ方向を継承
    const autoDirection: 'right' = 'right'

    const newNode: MindNode = {
      id: generateId(),
      text: '',
      children: [],
      collapsed: false,
      parentId,
      direction: autoDirection,
      x: 0,
      y: 0,
      depth: parent.depth + 1,
    }
    parent.children.push(newNode)
    applyLayout()

    selectedId.value = newNode.id
    editingId.value = newNode.id
  }

  function addSibling(id: string): void {
    if (!root.value || id === root.value.id) return
    const parent = findParent(root.value, id)
    if (!parent) return
    const currentNode = findNode(root.value, id)
    if (!currentNode) return

    takeSnapshot()

    const newNode: MindNode = {
      id: generateId(),
      text: '',
      children: [],
      collapsed: false,
      parentId: parent.id,
      direction: currentNode.direction,
      x: 0,
      y: 0,
      depth: currentNode.depth,
    }

    const idx = parent.children.findIndex(c => c.id === id)
    parent.children.splice(idx + 1, 0, newNode)
    applyLayout()

    selectedId.value = newNode.id
    editingId.value = newNode.id
  }

  function deleteNode(id: string): void {
    if (!root.value || id === root.value.id) return
    const parent = findParent(root.value, id)
    if (!parent) return

    takeSnapshot()

    parent.children = parent.children.filter(c => c.id !== id)
    selectedId.value = parent.id
    editingId.value = null
    applyLayout()
  }

  function updateText(id: string, text: string): void {
    const node = findNode(root.value, id)
    if (!node) return
    node.text = text
    saveToStorage(root.value!)
  }

  function startEdit(id: string): void {
    editingId.value = id
    selectedId.value = id
  }

  function finishEdit(id: string): void {
    const node = findNode(root.value, id)
    if (!node) return
    if (!node.text.trim() && node.parentId !== null) {
      // 空テキストで親がある場合はノードを削除
      deleteNode(id)
      return
    }
    editingId.value = null
    saveToStorage(root.value!)
  }

  function selectNode(id: string | null): void {
    selectedId.value = id
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function exportJSON(): void {
    if (!root.value) return
    const json = JSON.stringify(root.value, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindmap.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON(json: string): void {
    try {
      const parsed = JSON.parse(json) as MindNode
      takeSnapshot()
      root.value = parsed
      selectedId.value = parsed.id
      editingId.value = null
      applyLayout()
    } catch (e) {
      console.error('Invalid JSON:', e)
      alert('無効なJSONファイルです')
    }
  }

  function undo(): void {
    if (!history.canUndo()) return
    const prev = history.undo(root.value)
    if (prev) {
      root.value = prev
      applyLayout()
      selectedId.value = null
      editingId.value = null
    }
  }

  function redo(): void {
    if (!history.canRedo()) return
    const next = history.redo(root.value)
    if (next) {
      root.value = next
      applyLayout()
      selectedId.value = null
      editingId.value = null
    }
  }

  function loadFromSaved(): void {
    const saved = loadFromStorage()
    if (!saved) return
    root.value = saved
    selectedId.value = saved.id
    editingId.value = null
    history.clear()
    applyLayout()
  }

  return {
    root,
    selectedId,
    editingId,
    theme,
    history,
    allNodes,
    allLinks,
    initMap,
    resetMap,
    addChild,
    addSibling,
    deleteNode,
    updateText,
    startEdit,
    finishEdit,
    selectNode,
    toggleTheme,
    exportJSON,
    importJSON,
    undo,
    redo,
    loadFromSaved,
  }
})
