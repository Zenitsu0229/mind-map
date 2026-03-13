import { ref, nextTick } from 'vue'

export const NODE_W = 150
export const NODE_H = 44
export const H_GAP  = 220
export const V_GAP  = 110

export function useMindMap() {
  const nodes = ref([])
  const links = ref([])
  let nextId = 1

  // ── Input ref registry (for auto-focus on new nodes) ──────────────────────
  const inputRefs = {}

  function registerInput(el, id) {
    if (el) inputRefs[id] = el
    else    delete inputRefs[id]
  }

  function focusInput(id) {
    inputRefs[id]?.focus()
  }

  // ── Map initialization ─────────────────────────────────────────────────────
  function startMap(text) {
    const cx = window.innerWidth  / 2 - NODE_W / 2
    const cy = window.innerHeight / 2 - NODE_H / 2
    nodes.value = [{
      id:       nextId++,
      text,
      x:        cx,
      y:        cy,
      editing:  false,
      parentId: null,
      direction: null,
    }]
    links.value = []
    nextId = 2
  }

  function resetMap() {
    nodes.value = []
    links.value = []
    nextId = 1
  }

  // ── Node operations ────────────────────────────────────────────────────────
  async function addNode(parent, direction) {
    // Prevent duplicate in the same direction from the same parent
    const exists = nodes.value.some(
      n => n.parentId === parent.id && n.direction === direction
    )
    if (exists) return

    const offsets = {
      top:    { x: 0,      y: -V_GAP },
      bottom: { x: 0,      y:  V_GAP },
      left:   { x: -H_GAP, y: 0      },
      right:  { x:  H_GAP, y: 0      },
    }
    const { x: dx, y: dy } = offsets[direction]

    const newNode = {
      id:        nextId++,
      text:      '',
      x:         parent.x + dx,
      y:         parent.y + dy,
      editing:   true,
      parentId:  parent.id,
      direction,
    }
    nodes.value.push(newNode)
    links.value.push({
      id:       `${parent.id}-${newNode.id}`,
      parentId: parent.id,
      childId:  newNode.id,
    })

    await nextTick()
    focusInput(newNode.id)
  }

  function finishEdit(node) {
    if (!node.text.trim()) {
      cancelEdit(node)
      return
    }
    node.editing = false
  }

  function cancelEdit(node) {
    if (!node.text.trim()) {
      nodes.value = nodes.value.filter(n => n.id !== node.id)
      links.value = links.value.filter(l => l.childId !== node.id)
    } else {
      node.editing = false
    }
  }

  function startEdit(node) {
    node.editing = true
    nextTick(() => focusInput(node.id))
  }

  // ── SVG path ───────────────────────────────────────────────────────────────
  function nodeCenter(id) {
    const n = nodes.value.find(n => n.id === id)
    return n
      ? { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 }
      : { x: 0, y: 0 }
  }

  function linkPath(link) {
    const p  = nodeCenter(link.parentId)
    const c  = nodeCenter(link.childId)
    const mx = (p.x + c.x) / 2
    return `M${p.x},${p.y} C${mx},${p.y} ${mx},${c.y} ${c.x},${c.y}`
  }

  return {
    nodes,
    links,
    startMap,
    resetMap,
    addNode,
    finishEdit,
    cancelEdit,
    startEdit,
    registerInput,
    linkPath,
  }
}
