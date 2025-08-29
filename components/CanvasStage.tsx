"use client"
import { useEffect, useRef, useState } from "react"
import { QUOTES } from "@/lib/quotes"
import { drawCard } from "@/lib/draw"

const W = 1200, H = 675

export default function CanvasStage() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [quote, setQuote] = useState<string>("")

  function nextQuote() {
    const s = new Set(seen)
    if (s.size === QUOTES.length) s.clear()
    let i = 0
    do { i = Math.floor(Math.random() * QUOTES.length) } while (s.has(i))
    s.add(i); setSeen(s); return QUOTES[i]
  }

  const render = (q: string) => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext("2d"); if (!ctx) return
    drawCard(ctx, c.width, c.height, q)
  }

  useEffect(() => {
    const q = nextQuote(); setQuote(q)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { if (quote) render(quote) }, [quote])

  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text) } catch {} }

  const download = () => {
    const c = ref.current; if (!c) return
    const link = document.createElement("a")
    link.download = "cope-station.png"
    link.href = c.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold opacity-90">Cope Station</h1>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-white/10">
        <canvas 
          ref={ref} 
          width={W} 
          height={H} 
          className="w-full h-auto max-h-[60vh] object-contain" 
          style={{ aspectRatio: `${W}/${H}` }}
          aria-label="preview" 
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={()=>setQuote(nextQuote())} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
          New Quote
        </button>
        <button onClick={()=>copy(quote)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
          Copy Text
        </button>
        <button onClick={()=>copy(`"${quote}" #copium #degen`)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
          Copy Tweet
        </button>
        <button onClick={download} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
          Download PNG
        </button>
      </div>
    </div>
  )
} 