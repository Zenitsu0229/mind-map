import html2canvas from 'html2canvas'

export async function exportAsJpeg(): Promise<void> {
  const canvasEl = document.querySelector('.canvas') as HTMLElement
  if (!canvasEl) return

  // ツールバーを一時的に非表示にしてキャプチャ
  const toolbar = document.querySelector('.toolbar') as HTMLElement
  const prevDisplay = toolbar?.style.display ?? ''
  if (toolbar) toolbar.style.display = 'none'

  try {
    const shot = await html2canvas(canvasEl, {
      backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--bg').trim() || '#0b0b10',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })

    shot.toBlob(
      (blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'mindmap.jpg'
        a.click()
        URL.revokeObjectURL(url)
      },
      'image/jpeg',
      0.92,
    )
  } finally {
    if (toolbar) toolbar.style.display = prevDisplay
  }
}
