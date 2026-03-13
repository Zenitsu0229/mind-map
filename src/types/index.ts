export interface MindNode {
  id: string
  text: string
  children: MindNode[]
  collapsed: boolean
  parentId: string | null
  direction: 'left' | 'right' | 'top' | 'bottom' | null
  x: number
  y: number
  depth: number
}

export interface LinkInfo {
  id: string
  parentId: string
  childId: string
  depth: number
}
