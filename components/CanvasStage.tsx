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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Cope Station
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Generate instantly-shareable copium quotes on slick meme backgrounds
          </p>
        </div>

        {/* Canvas Container */}
        <div className="w-full max-w-3xl">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Canvas */}
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
              <canvas 
                ref={ref} 
                width={W} 
                height={H} 
                className="w-full h-auto rounded-2xl shadow-2xl" 
                style={{ aspectRatio: `${W}/${H}` }}
                aria-label="preview" 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={()=>setQuote(nextQuote())} 
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🎲 New Quote
          </button>
          
          <button 
            onClick={()=>copy(quote)} 
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            📋 Copy Text
          </button>
          
          <button 
            onClick={()=>copy(`"${quote}" #copium #degen`)} 
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🐦 Copy Tweet
          </button>
          
          <button 
            onClick={download} 
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            💾 Download PNG
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 pt-8">
          <p className="text-sm">
            Built for the <span className="font-semibold text-purple-400">#30DaysAIChallenge</span> 🚀
          </p>
        </div>
      </div>
    </div>
  )
} 