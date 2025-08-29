export function drawCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  footer = "Cope Station"
) {
  // bg
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, "#0f172a"); g.addColorStop(1, "#1f2937")
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h)
  // noise
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 3000; i++) ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1)
  ctx.globalAlpha = 1
  // frame
  ctx.strokeStyle = "rgba(255,255,255,.08)"; ctx.lineWidth = 8
  ctx.strokeRect(16,16,w-32,h-32)

  // text fit
  const pad = w * 0.1, maxWidth = w * 0.8
  const fit = (min: number, max: number) => {
    let lo = min, hi = max
    const measure = (sz: number) => {
      ctx.font = `800 ${sz}px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
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
      const height = lines.length * mid * 1.3
      if (height <= h * 0.68) lo = mid; else hi = mid
    }
    ctx.font = `800 ${lo}px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
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
  const lines = fit(34, 96)

  // choose color (simple: white with shadow)
  ctx.textAlign = "center"; ctx.textBaseline = "top"
  ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 14; ctx.fillStyle = "#fff"

  // draw text
  const fontSize = parseInt(ctx.font.match(/(\d+)px/)?.[1] || "48")
  const totalH = lines.length * fontSize * 1.3
  const startY = (h - totalH) / 2
  lines.forEach((ln, i) => ctx.fillText(ln, w/2, startY + i*fontSize*1.3))

  // footer
  ctx.shadowBlur = 0; ctx.globalAlpha = .75
  ctx.font = "700 24px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillText(footer, w/2, h - 56)
  ctx.globalAlpha = 1
} 