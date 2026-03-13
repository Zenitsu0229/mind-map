import type { MindNode } from '../types'

const STORAGE_KEY = 'mind-map-data'
let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function saveToStorage(root: MindNode): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(root))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
    debounceTimer = null
  }, 500)
}

export function loadFromStorage(): MindNode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MindNode
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
    return null
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasStoredData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}
