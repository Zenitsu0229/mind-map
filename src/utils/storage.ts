import type { MindNode } from '../types'

const STORAGE_KEY = 'mind-map-data'
const COLOR_THEME_KEY = 'mind-map-color-theme'
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

export function saveColorTheme(colors: Record<string, string>): void {
  try {
    localStorage.setItem(COLOR_THEME_KEY, JSON.stringify(colors))
  } catch (e) {
    console.error('Failed to save color theme:', e)
  }
}

export function loadColorTheme(): Record<string, string> {
  try {
    const raw = localStorage.getItem(COLOR_THEME_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

export function clearColorTheme(): void {
  localStorage.removeItem(COLOR_THEME_KEY)
}
