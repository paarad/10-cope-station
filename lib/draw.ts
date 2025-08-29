export function drawCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  footer = "Cope Station"
) {
  // Clean, modern background
  const g1 = ctx.createLinearGradient(0, 0, w, h)
  g1.addColorStop(0, "#fafafa")
  g1.addColorStop(0.5, "#f5f5f5")
  g1.addColorStop(1, "#e5e5e5")
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, w, h)
  
  // Subtle texture overlay
  ctx.globalAlpha = 0.02
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = "#000000"
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  ctx.globalAlpha = 1
  
  // Clean border
  ctx.strokeStyle = "#e5e5e5"
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, w-2, h-2)

  // Smart text wrapping that balances lines
  const maxWidth = w * 0.8
  const fit = (min: number, max: number) => {
    let lo = min, hi = max
    
    const wrapText = (sz: number) => {
      ctx.font = `600 ${sz}px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
      const words = text.split(" ")
      const lines: string[] = []
      
      if (words.length <= 2) {
        // For short quotes, just put them on one line
        return [text]
      }
      
      // Try to balance the lines
      const totalWords = words.length
      const targetLines = Math.ceil(totalWords / 2) // Aim for 2-3 lines
      
      let currentLine = ""
      let lineCount = 0
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const testWidth = ctx.measureText(testLine).width
        
        // If adding this word would make the line too long
        if (testWidth > maxWidth) {
          // If we have a current line, finish it and start new line
          if (currentLine) {
            lines.push(currentLine)
            currentLine = word
            lineCount++
          } else {
            // If no current line, force the word (it's too long)
            lines.push(word)
            lineCount++
          }
        } else {
          // Check if we should break here to balance lines
          const remainingWords = words.length - i - 1
          const remainingLines = targetLines - lineCount - 1
          
          if (remainingWords > 0 && remainingLines > 0 && 
              remainingWords / remainingLines <= 2 && 
              currentLine && testWidth > maxWidth * 0.6) {
            // Break here to balance the remaining words
            lines.push(currentLine)
            currentLine = word
            lineCount++
          } else {
            // Continue building current line
            currentLine = testLine
          }
        }
      }
      
      // Add the last line
      if (currentLine) {
        lines.push(currentLine)
      }
      
      return lines
    }
    
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi)/2)
      const lines = wrapText(mid)
      const height = lines.length * mid * 1.4
      if (height <= h * 0.7) lo = mid; else hi = mid
    }
    
    // Get final lines with optimal font size
    return wrapText(lo)
  }
  
  const lines = fit(32, 80)

  // Clean, modern text
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  
  // Simple shadow for depth
  ctx.shadowColor = "rgba(0,0,0,0.1)"
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2
  
  // Draw text
  const fontSize = parseInt(ctx.font.match(/(\d+)px/)?.[1] || "48")
  const totalH = lines.length * fontSize * 1.4
  const startY = (h - totalH) / 2
  
  lines.forEach((ln, i) => {
    ctx.fillStyle = "#171717"
    ctx.fillText(ln, w/2, startY + i*fontSize*1.4)
  })
  
  // Reset shadows for footer
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // Clean footer
  ctx.globalAlpha = 0.7
  ctx.font = "500 20px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillStyle = "#737373"
  ctx.fillText(footer, w/2, h - 40)
  
  ctx.globalAlpha = 1
} 