import { toJpeg } from 'html-to-image'

export async function exportAsJpeg(): Promise<void> {
  const canvasEl = document.querySelector('.canvas') as HTMLElement
  if (!canvasEl) return

  const toolbar = document.querySelector('.toolbar') as HTMLElement
  const prevDisplay = toolbar?.style.display ?? ''
  if (toolbar) toolbar.style.display = 'none'

  try {
    const dataUrl = await toJpeg(canvasEl, {
      quality: 0.92,
      pixelRatio: 2,
      skipFonts: true,
      backgroundColor:
        getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0c0c0c',
    })

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'mindmap.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    if (toolbar) toolbar.style.display = prevDisplay
  }
}
