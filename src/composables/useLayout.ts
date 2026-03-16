import type { MindNode } from '../types'

export const NODE_W = 160
export const NODE_H = 36
export const H_GAP  = 210
export const V_GAP  = 52

/**
 * サブツリーが占める縦スロット数を返す（葉=1、それ以外=子の合計）
 */
function getSubtreeSize(node: MindNode): number {
  if (node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + getSubtreeSize(child), 0)
}

/**
 * 上揃えレイアウト：
 * - 最初の子は親と同じY座標（水平）
 * - 2つ目以降はその下に積み重ねる
 */
function layoutBranch(
  nodes: MindNode[],
  parent: MindNode,
  direction: 'left' | 'right',
  depth: number,
  startY: number,
): void {
  if (nodes.length === 0) return

  const sign = direction === 'right' ? 1 : -1
  let currentY = startY

  for (const node of nodes) {
    const size = getSubtreeSize(node)

    node.x         = parent.x + sign * H_GAP
    node.y         = currentY
    node.depth     = depth
    node.direction = direction

    // 子ノードも同じ上揃えルールで再帰
    layoutBranch(node.children, node, direction, depth + 1, currentY)

    currentY += size * V_GAP
  }
}

/**
 * ルートを (0,0) に固定してツリー全体を再計算する
 */
export function calcLayout(root: MindNode): void {
  root.x     = 0
  root.y     = 0
  root.depth = 0

  root.children.forEach(child => {
    child.direction = 'right'
  })

  layoutBranch(root.children, root, 'right', 1, root.y)
}
