"use client"
import { useEffect, useRef, useState } from "react"
import { QUOTES } from "@/lib/quotes"
import { drawCard } from "@/lib/draw"
import { track } from '@vercel/analytics'

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
    s.add(i); setSeen(s); 
    
    // Track quote generation
    track('quote_generated', { 
      quote_index: i,
      total_seen: s.size,
      quote_length: QUOTES[i].length 
    })
    
    return QUOTES[i]
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

  const copy = async (text: string, type: 'text' | 'tweet') => { 
    try { 
      await navigator.clipboard.writeText(text) 
      track('content_copied', { 
        type,
        quote_length: text.length,
        has_hashtags: type === 'tweet'
      })
    } catch (error) {
      track('copy_failed', { type, error: String(error) })
    } 
  }

  const download = () => {
    const c = ref.current; if (!c) return
    const link = document.createElement("a")
    link.download = "cope-station.png"
    link.href = c.toDataURL("image/png")
    link.click()
    
    track('image_downloaded', { 
      canvas_width: W,
      canvas_height: H,
      quote_length: quote.length
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-light text-neutral-900 dark:text-neutral-100 mb-4">
            Cope Station
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Generate instantly-shareable copium quotes on clean, modern backgrounds
          </p>
        </div>

        {/* Canvas Container */}
        <div className="mb-12">
          <div className="relative">
            <canvas 
              ref={ref} 
              width={W} 
              height={H} 
              className="w-full h-auto rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800" 
              style={{ aspectRatio: `${W}/${H}` }}
              aria-label="preview" 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={()=>setQuote(nextQuote())} 
            className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors duration-200"
          >
            New Quote
          </button>
          
          <button 
            onClick={()=>copy(quote, 'text')} 
            className="px-6 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Copy Text
          </button>
          
          <button 
            onClick={()=>copy(`"${quote}" #copium #degen`, 'tweet')} 
            className="px-6 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Copy Tweet
          </button>
          
          <button 
            onClick={download} 
            className="px-6 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Download PNG
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Built for the <span className="font-medium">#30DaysAIChallenge</span>
          </p>
        </div>
      </div>
    </div>
  )
} 