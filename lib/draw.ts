export function drawCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  footer = "Cope Station"
) {
  // Enhanced background with multiple gradients
  const g1 = ctx.createLinearGradient(0, 0, w, h)
  g1.addColorStop(0, "#0f172a")
  g1.addColorStop(0.3, "#1e1b4b")
  g1.addColorStop(0.7, "#581c87")
  g1.addColorStop(1, "#1f2937")
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, w, h)
  
  // Add subtle radial gradient overlay
  const g2 = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/1.5)
  g2.addColorStop(0, "rgba(139, 92, 246, 0.1)")
  g2.addColorStop(1, "rgba(0, 0, 0, 0)")
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, w, h)
  
  // Enhanced noise with different opacities
  ctx.globalAlpha = 0.03
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  ctx.globalAlpha = 0.02
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
  ctx.globalAlpha = 1
  
  // Enhanced frame with gradient
  const frameGradient = ctx.createLinearGradient(0, 0, w, h)
  frameGradient.addColorStop(0, "rgba(139, 92, 246, 0.3)")
  frameGradient.addColorStop(0.5, "rgba(236, 72, 153, 0.3)")
  frameGradient.addColorStop(1, "rgba(34, 211, 238, 0.3)")
  
  ctx.strokeStyle = frameGradient
  ctx.lineWidth = 12
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.strokeRect(20, 20, w-40, h-40)
  
  // Inner glow effect
  ctx.strokeStyle = "rgba(139, 92, 246, 0.1)"
  ctx.lineWidth = 4
  ctx.strokeRect(32, 32, w-64, h-64)

  // text fit
  const maxWidth = w * 0.75
  const fit = (min: number, max: number) => {
    let lo = min, hi = max
    const measure = (sz: number) => {
      ctx.font = `900 ${sz}px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
      const words = text.split(" "); const lines: string[] = []
      let line = ""
      for (const word of words) {
        const test = line ? `${line} ${word}` : word
        if (ctx.measureText(test).width <= maxWidth) line = test
        else { lines.push(line); line = word }
      }
      if (line) lines.push(line)
      return lines
    }
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi)/2)
      const lines = measure(mid)
      const height = lines.length * mid * 1.4
      if (height <= h * 0.65) lo = mid; else hi = mid
    }
    ctx.font = `900 ${lo}px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
    const lines = text.split(" "); // recompute lines
    // do the same loop again:
    const words = text.split(" "); const out: string[] = []; let line = ""
    for (const w2 of words) {
      const test = line ? `${line} ${w2}` : w2
      if (ctx.measureText(test).width <= maxWidth) line = test
      else { out.push(line); line = w2 }
    }
    if (line) out.push(line)
    return out
  }
  const lines = fit(36, 100)

  // Enhanced text with multiple shadows and gradient
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  
  // Text gradient
  const textGradient = ctx.createLinearGradient(0, 0, w, h)
  textGradient.addColorStop(0, "#fbbf24")
  textGradient.addColorStop(0.3, "#f59e0b")
  textGradient.addColorStop(0.7, "#d97706")
  textGradient.addColorStop(1, "#b45309")
  
  // Multiple shadows for depth
  ctx.shadowColor = "rgba(0,0,0,0.8)"
  ctx.shadowBlur = 20
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 4
  
  // Draw text with gradient
  const fontSize = parseInt(ctx.font.match(/(\d+)px/)?.[1] || "48")
  const totalH = lines.length * fontSize * 1.4
  const startY = (h - totalH) / 2
  
  lines.forEach((ln, i) => {
    ctx.fillStyle = textGradient
    ctx.fillText(ln, w/2, startY + i*fontSize*1.4)
  })
  
  // Reset shadows for footer
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // Enhanced footer
  ctx.globalAlpha = 0.9
  ctx.font = "700 28px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  
  // Footer background
  const footerBg = ctx.createLinearGradient(w/2 - 100, h - 80, w/2 + 100, h - 40)
  footerBg.addColorStop(0, "rgba(0,0,0,0.6)")
  footerBg.addColorStop(1, "rgba(0,0,0,0.3)")
  
  ctx.fillStyle = footerBg
  ctx.fillRect(w/2 - 120, h - 90, 240, 50)
  
  // Footer text
  ctx.fillStyle = "#fbbf24"
  ctx.fillText(footer, w/2, h - 70)
  
  ctx.globalAlpha = 1
} 