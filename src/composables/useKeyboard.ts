import { onMounted, onUnmounted, ref } from 'vue'
import { useMindMapStore } from '../stores/mindmapStore'

export function useKeyboard() {
  const store = useMindMapStore()
  const showShortcuts = ref(false)

  function getAdjacentNode(currentId: string, direction: 'up' | 'down' | 'left' | 'right'): string | null {
    if (!store.root) return null
    const allNodes = store.allNodes
    const current = allNodes.find(n => n.id === currentId)
    if (!current) return null

    switch (direction) {
      case 'left': {
        // 親ノードへ移動
        if (current.parentId) return current.parentId
        return null
      }
      case 'right': {
        // 最初の子ノードへ移動
        if (current.children && current.children.length > 0) {
          return current.children[0].id
        }
        return null
      }
      case 'up': {
        // 同じ親の前の兄弟へ
        if (!current.parentId) return null
        const parentNode = allNodes.find(n => n.id === current.parentId)
        if (!parentNode) return null
        const siblings = parentNode.children
        const idx = siblings.findIndex(c => c.id === currentId)
        if (idx > 0) return siblings[idx - 1].id
        return null
      }
      case 'down': {
        // 同じ親の次の兄弟へ
        if (!current.parentId) return null
        const parentNode = allNodes.find(n => n.id === current.parentId)
        if (!parentNode) return null
        const siblings = parentNode.children
        const idx = siblings.findIndex(c => c.id === currentId)
        if (idx < siblings.length - 1) return siblings[idx + 1].id
        return null
      }
    }
  }

  function onKeydown(e: KeyboardEvent): void {
    const isEditing = store.editingId !== null
    const selectedId = store.selectedId

    // グローバルショートカット
    const isMac = navigator.platform.toUpperCase().includes('MAC')
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey

    if (ctrlOrCmd && !e.shiftKey && e.key === 'z') {
      e.preventDefault()
      store.undo()
      return
    }

    if (
      (ctrlOrCmd && e.key === 'y') ||
      (ctrlOrCmd && e.shiftKey && e.key === 'z')
    ) {
      e.preventDefault()
      store.redo()
      return
    }

    if (e.key === '?' && !isEditing) {
      showShortcuts.value = !showShortcuts.value
      return
    }

    if (e.key === 'Escape') {
      if (showShortcuts.value) {
        showShortcuts.value = false
        return
      }
      if (isEditing && selectedId) {
        store.finishEdit(selectedId)
        return
      }
      store.selectNode(null)
      return
    }

    // ノード選択中のショートカット
    if (!selectedId) return

    if (!isEditing) {
      if (e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        store.addChild(selectedId)
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        if (selectedId === store.root?.id) {
          store.addChild(selectedId)
        } else {
          store.addSibling(selectedId)
        }
        return
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        e.stopPropagation()
        store.deleteNode(selectedId)
        return
      }

      if (e.key === 'F2') {
        e.preventDefault()
        store.startEdit(selectedId)
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = getAdjacentNode(selectedId, 'up')
        if (next) store.selectNode(next)
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = getAdjacentNode(selectedId, 'down')
        if (next) store.selectNode(next)
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const next = getAdjacentNode(selectedId, 'left')
        if (next) store.selectNode(next)
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = getAdjacentNode(selectedId, 'right')
        if (next) store.selectNode(next)
        return
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown, true)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown, true)
  })

  return {
    showShortcuts,
  }
}
