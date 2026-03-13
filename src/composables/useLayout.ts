import type { MindNode } from '../types'

export const NODE_W = 150
export const NODE_H = 44
export const H_GAP  = 220
export const V_GAP  = 90

/**
 * ノードのサブツリーが必要とする「単位数」を返す。
 * 葉ノードは 1、それ以外は子の単位数の合計。
 * これを使って各ノードの垂直スペースを均等に配分する。
 */
function getSubtreeSize(node: MindNode): number {
  if (node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + getSubtreeSize(child), 0)
}

/**
 * サブツリー全体を再帰的にレイアウトする。
 * - parent   : 親ノード（既にx,yが確定済み）
 * - nodes    : 配置する子ノード群
 * - direction: 'left' | 'right'
 * - depth    : 現在の深さ
 */
function layoutBranch(
  nodes: MindNode[],
  parent: MindNode,
  direction: 'left' | 'right',
  depth: number,
): void {
  if (nodes.length === 0) return

  const sign     = direction === 'right' ? 1 : -1
  const totalSize = nodes.reduce((s, n) => s + getSubtreeSize(n), 0)
  const totalH    = totalSize * V_GAP

  let currentY = parent.y - totalH / 2

  for (const node of nodes) {
    const size = getSubtreeSize(node)
    const h    = size * V_GAP

    node.x         = parent.x + sign * H_GAP
    node.y         = currentY + h / 2
    node.depth     = depth
    node.direction = direction

    layoutBranch(node.children, node, direction, depth + 1)

    currentY += h
  }
}

/**
 * ルートノードを (0,0) として全ノードのx,yを再計算する。
 * ルートの子は「偶数インデックス→右、奇数インデックス→左」に自動分配。
 */
export function calcLayout(root: MindNode): void {
  root.x     = 0
  root.y     = 0
  root.depth = 0

  // ルート直下は方向を再アサイン（追加順に右/左交互）
  root.children.forEach((child, i) => {
    child.direction = i % 2 === 0 ? 'right' : 'left'
  })

  const rightChildren = root.children.filter(c => c.direction === 'right')
  const leftChildren  = root.children.filter(c => c.direction === 'left')

  layoutBranch(rightChildren, root, 'right', 1)
  layoutBranch(leftChildren,  root, 'left',  1)
}
