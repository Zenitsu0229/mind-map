<template>
  <div class="color-panel" @click.stop @mousedown.stop>
    <div class="panel-header">
      <span class="panel-title">カラー設定</span>
      <button class="close-btn" @click="emit('close')">✕</button>
    </div>

    <!-- プリセット -->
    <div class="section">
      <div class="section-label">プリセット</div>
      <div class="presets-grid">
        <button
          v-for="preset in PRESETS"
          :key="preset.id"
          class="preset-btn"
          :class="{ active: activePresetId === preset.id }"
          :title="preset.name"
          @click="applyPreset(preset)"
        >
          <div class="preset-swatches">
            <div class="swatch" :style="{ background: preset.colors['--bg'] }"></div>
            <div class="swatch" :style="{ background: preset.colors['--surface'] }"></div>
            <div class="swatch" :style="{ background: preset.colors['--text-primary'] }"></div>
            <div class="swatch" :style="{ background: preset.colors['--accent'] }"></div>
          </div>
          <span class="preset-name">{{ preset.name }}</span>
        </button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- カラー個別編集 -->
    <div class="colors-scroll">
      <div v-for="group in COLOR_GROUPS" :key="group.label" class="section">
        <div class="section-label">{{ group.label }}</div>
        <div
          v-for="item in group.vars"
          :key="item.key"
          class="color-row"
        >
          <label class="color-label">{{ item.label }}</label>
          <div class="color-input-wrap">
            <input
              type="color"
              class="color-picker"
              :value="toHex(localColors[item.key])"
              @input="onPickerInput(item.key, ($event.target as HTMLInputElement).value)"
            />
            <input
              type="text"
              class="color-text"
              :value="localColors[item.key]"
              :placeholder="item.placeholder"
              @change="onTextChange(item.key, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- アクション -->
    <div class="panel-actions">
      <button class="action-btn" @click="onExport" title="カラー設定をJSONで書き出す">保存</button>
      <button class="action-btn" @click="triggerImport" title="JSONからカラー設定を読み込む">読込</button>
      <button class="action-btn danger" @click="onReset" title="全色をデフォルトに戻す">リセット</button>
    </div>

    <input ref="importRef" type="file" accept=".json" style="display:none" @change="onImportFile" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useMindMapStore } from '../stores/mindmapStore'

interface Preset {
  id: string
  name: string
  baseTheme: 'dark' | 'light'
  colors: Record<string, string>
}

interface ColorItem {
  key: string
  label: string
  placeholder: string
}

interface ColorGroup {
  label: string
  vars: ColorItem[]
}

const PRESETS: Preset[] = [
  {
    id: 'dark',
    name: 'ダーク',
    baseTheme: 'dark',
    colors: {
      '--bg': '#0c0c0c',
      '--surface': '#141414',
      '--surface-raised': '#1e1e1e',
      '--border': '#2e2e2e',
      '--border-active': '#484848',
      '--text-primary': '#ececec',
      '--text-secondary': '#5a5a5a',
      '--accent': '#d0d0d0',
      '--accent-glow': 'rgba(208,208,208,0.08)',
      '--accent-dim': 'rgba(208,208,208,0.06)',
      '--node-root-bg': 'rgba(236,236,236,0.04)',
      '--node-root-border': '#ececec',
      '--toolbar-bg': 'rgba(10,10,10,0.97)',
      '--toolbar-border': '#2a2a2a',
      '--toolbar-text': '#c0c0c0',
      '--toolbar-btn-hover': 'rgba(255,255,255,0.06)',
      '--overlay-bg': 'rgba(0,0,0,0.78)',
    },
  },
  {
    id: 'light',
    name: 'ライト',
    baseTheme: 'light',
    colors: {
      '--bg': '#f0f0f0',
      '--surface': '#ffffff',
      '--surface-raised': '#f8f8f8',
      '--border': '#e0e0e0',
      '--border-active': '#b0b0b0',
      '--text-primary': '#0c0c0c',
      '--text-secondary': '#888888',
      '--accent': '#1a1a1a',
      '--accent-glow': 'rgba(26,26,26,0.08)',
      '--accent-dim': 'rgba(26,26,26,0.05)',
      '--node-root-bg': 'rgba(0,0,0,0.03)',
      '--node-root-border': '#0c0c0c',
      '--toolbar-bg': 'rgba(255,255,255,0.98)',
      '--toolbar-border': '#e0e0e0',
      '--toolbar-text': '#333333',
      '--toolbar-btn-hover': 'rgba(0,0,0,0.05)',
      '--overlay-bg': 'rgba(0,0,0,0.45)',
    },
  },
  {
    id: 'midnight',
    name: 'ミッドナイト',
    baseTheme: 'dark',
    colors: {
      '--bg': '#0d1117',
      '--surface': '#161b22',
      '--surface-raised': '#21262d',
      '--border': '#30363d',
      '--border-active': '#58a6ff',
      '--text-primary': '#e6edf3',
      '--text-secondary': '#7d8590',
      '--accent': '#58a6ff',
      '--accent-glow': 'rgba(88,166,255,0.08)',
      '--accent-dim': 'rgba(88,166,255,0.06)',
      '--node-root-bg': 'rgba(88,166,255,0.04)',
      '--node-root-border': '#58a6ff',
      '--toolbar-bg': 'rgba(13,17,23,0.97)',
      '--toolbar-border': '#30363d',
      '--toolbar-text': '#8b949e',
      '--toolbar-btn-hover': 'rgba(255,255,255,0.06)',
      '--overlay-bg': 'rgba(0,0,0,0.78)',
    },
  },
  {
    id: 'forest',
    name: 'フォレスト',
    baseTheme: 'dark',
    colors: {
      '--bg': '#0d1210',
      '--surface': '#141c18',
      '--surface-raised': '#1c2820',
      '--border': '#2a3d2e',
      '--border-active': '#4a7c59',
      '--text-primary': '#d4e8d4',
      '--text-secondary': '#5a7a5a',
      '--accent': '#6abf7a',
      '--accent-glow': 'rgba(106,191,122,0.08)',
      '--accent-dim': 'rgba(106,191,122,0.06)',
      '--node-root-bg': 'rgba(106,191,122,0.04)',
      '--node-root-border': '#6abf7a',
      '--toolbar-bg': 'rgba(13,18,16,0.97)',
      '--toolbar-border': '#2a3d2e',
      '--toolbar-text': '#8ab890',
      '--toolbar-btn-hover': 'rgba(255,255,255,0.04)',
      '--overlay-bg': 'rgba(0,0,0,0.78)',
    },
  },
  {
    id: 'sepia',
    name: 'セピア',
    baseTheme: 'light',
    colors: {
      '--bg': '#f4ede4',
      '--surface': '#fdf6ed',
      '--surface-raised': '#fff9f2',
      '--border': '#d4c4a8',
      '--border-active': '#a08060',
      '--text-primary': '#3c2a1a',
      '--text-secondary': '#8c7060',
      '--accent': '#7c5030',
      '--accent-glow': 'rgba(124,80,48,0.08)',
      '--accent-dim': 'rgba(124,80,48,0.05)',
      '--node-root-bg': 'rgba(124,80,48,0.04)',
      '--node-root-border': '#7c5030',
      '--toolbar-bg': 'rgba(244,237,228,0.98)',
      '--toolbar-border': '#d4c4a8',
      '--toolbar-text': '#5c4030',
      '--toolbar-btn-hover': 'rgba(0,0,0,0.05)',
      '--overlay-bg': 'rgba(0,0,0,0.45)',
    },
  },
  {
    id: 'dracula',
    name: 'ドラキュラ',
    baseTheme: 'dark',
    colors: {
      '--bg': '#282a36',
      '--surface': '#2e3045',
      '--surface-raised': '#373952',
      '--border': '#44475a',
      '--border-active': '#bd93f9',
      '--text-primary': '#f8f8f2',
      '--text-secondary': '#6272a4',
      '--accent': '#bd93f9',
      '--accent-glow': 'rgba(189,147,249,0.08)',
      '--accent-dim': 'rgba(189,147,249,0.06)',
      '--node-root-bg': 'rgba(189,147,249,0.04)',
      '--node-root-border': '#bd93f9',
      '--toolbar-bg': 'rgba(40,42,54,0.97)',
      '--toolbar-border': '#44475a',
      '--toolbar-text': '#8be9fd',
      '--toolbar-btn-hover': 'rgba(255,255,255,0.06)',
      '--overlay-bg': 'rgba(0,0,0,0.78)',
    },
  },
]

const COLOR_GROUPS: ColorGroup[] = [
  {
    label: '背景',
    vars: [
      { key: '--bg', label: 'ページ背景', placeholder: '#0c0c0c' },
      { key: '--surface', label: 'サーフェス', placeholder: '#141414' },
      { key: '--surface-raised', label: 'サーフェス（高）', placeholder: '#1e1e1e' },
    ],
  },
  {
    label: 'テキスト',
    vars: [
      { key: '--text-primary', label: 'メイン', placeholder: '#ececec' },
      { key: '--text-secondary', label: 'サブ', placeholder: '#5a5a5a' },
    ],
  },
  {
    label: 'ボーダー',
    vars: [
      { key: '--border', label: '通常', placeholder: '#2e2e2e' },
      { key: '--border-active', label: 'アクティブ', placeholder: '#484848' },
    ],
  },
  {
    label: 'アクセント',
    vars: [
      { key: '--accent', label: 'アクセント', placeholder: '#d0d0d0' },
      { key: '--accent-glow', label: 'グロー', placeholder: 'rgba(208,208,208,0.08)' },
      { key: '--accent-dim', label: 'ディム', placeholder: 'rgba(208,208,208,0.06)' },
    ],
  },
  {
    label: 'ノード',
    vars: [
      { key: '--node-root-bg', label: 'ルート背景', placeholder: 'rgba(236,236,236,0.04)' },
      { key: '--node-root-border', label: 'ルートボーダー', placeholder: '#ececec' },
    ],
  },
  {
    label: 'ツールバー',
    vars: [
      { key: '--toolbar-bg', label: '背景', placeholder: 'rgba(10,10,10,0.97)' },
      { key: '--toolbar-border', label: 'ボーダー', placeholder: '#2a2a2a' },
      { key: '--toolbar-text', label: 'テキスト', placeholder: '#c0c0c0' },
      { key: '--toolbar-btn-hover', label: 'ボタンホバー', placeholder: 'rgba(255,255,255,0.06)' },
    ],
  },
  {
    label: 'オーバーレイ',
    vars: [
      { key: '--overlay-bg', label: '背景', placeholder: 'rgba(0,0,0,0.78)' },
    ],
  },
]

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useMindMapStore()
const importRef = ref<HTMLInputElement | null>(null)
const activePresetId = ref<string | null>(null)

// ローカル編集用（storeのcustomColorsをコピー）
const localColors = reactive<Record<string, string>>({ ...store.customColors })

// store → ローカルを同期（外部から変更された場合）
watch(
  () => store.customColors,
  (v) => {
    Object.keys(localColors).forEach(k => delete localColors[k])
    Object.assign(localColors, v)
  },
  { deep: true }
)

function getCurrentValue(key: string): string {
  return localColors[key] ?? ''
}

/** rgba/hex → hex (#rrggbb) に変換（colorPickerのvalue用） */
function toHex(value: string): string {
  if (!value) return '#000000'
  if (value.startsWith('#')) return value.slice(0, 7)
  const m = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (m) {
    return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
  }
  return '#000000'
}

function onPickerInput(key: string, hex: string): void {
  localColors[key] = hex
  store.setCustomColor(key, hex)
  activePresetId.value = null
}

function onTextChange(key: string, value: string): void {
  localColors[key] = value
  store.setCustomColor(key, value)
  activePresetId.value = null
}

function applyPreset(preset: Preset): void {
  activePresetId.value = preset.id
  Object.keys(localColors).forEach(k => delete localColors[k])
  Object.assign(localColors, preset.colors)
  store.setCustomColors(preset.colors, preset.baseTheme)
}

function onReset(): void {
  if (!confirm('カラー設定をすべてリセットしますか？')) return
  activePresetId.value = null
  Object.keys(localColors).forEach(k => delete localColors[k])
  store.resetCustomColors()
}

function onExport(): void {
  const data = { ...store.customColors }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'color-theme.json'
  a.click()
  URL.revokeObjectURL(url)
}

function triggerImport(): void {
  importRef.value?.click()
}

function onImportFile(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string) as Record<string, string>
      activePresetId.value = null
      Object.keys(localColors).forEach(k => delete localColors[k])
      Object.assign(localColors, imported)
      store.setCustomColors(imported)
    } catch {
      alert('無効なJSONファイルです')
    }
  }
  reader.readAsText(file)
  input.value = ''
}
</script>

<style scoped>
.color-panel {
  position: fixed;
  right: 16px;
  top: 16px;
  bottom: 16px;
  width: 272px;
  display: flex;
  flex-direction: column;
  background: var(--toolbar-bg);
  border: 1px solid var(--toolbar-border);
  z-index: 200;
  backdrop-filter: blur(8px);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px 10px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--toolbar-text);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 11px;
  padding: 2px 4px;
  line-height: 1;
  transition: color 0.1s;
}

.close-btn:hover {
  color: var(--text-primary);
}

/* プリセット */
.presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 0 2px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 4px;
  background: transparent;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.1s;
}

.preset-btn:hover {
  border-color: var(--border-active);
}

.preset-btn.active {
  border-color: var(--text-primary);
}

.preset-swatches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  width: 28px;
  height: 28px;
}

.swatch {
  width: 100%;
  height: 100%;
}

.preset-name {
  font-size: 9px;
  color: var(--toolbar-text);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* セクション */
.section {
  padding: 4px 10px 6px;
}

.section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  padding-bottom: 4px;
}

.divider {
  height: 1px;
  background: var(--toolbar-border);
  margin: 2px 0;
  flex-shrink: 0;
}

/* スクロール領域 */
.colors-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.colors-scroll::-webkit-scrollbar {
  width: 4px;
}

.colors-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.colors-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
}

/* カラー行 */
.color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 2px 0;
}

.color-label {
  font-size: 10px;
  color: var(--toolbar-text);
  white-space: nowrap;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.01em;
}

.color-input-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.color-picker {
  width: 20px;
  height: 20px;
  border: 1px solid var(--border);
  padding: 1px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 0;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
}

.color-text {
  width: 112px;
  font-size: 10px;
  font-family: "Noto Sans JP", monospace;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 2px 5px;
  outline: none;
  border-radius: 0;
  transition: border-color 0.1s;
}

.color-text:focus {
  border-color: var(--border-active);
}

.color-text::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

/* アクション */
.panel-actions {
  display: flex;
  gap: 4px;
  padding: 8px 10px 10px;
  flex-shrink: 0;
}

.action-btn {
  flex: 1;
  padding: 5px 0;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--toolbar-text);
  font-size: 10px;
  font-family: "Noto Sans JP", sans-serif;
  cursor: pointer;
  transition: border-color 0.1s, color 0.1s;
  letter-spacing: 0.04em;
  border-radius: 0;
}

.action-btn:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
}

.action-btn.danger {
  color: var(--text-secondary);
}

.action-btn.danger:hover {
  border-color: #a05050;
  color: #e08080;
}
</style>
