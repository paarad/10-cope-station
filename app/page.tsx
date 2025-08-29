"use client"
import dynamic from "next/dynamic"
const CanvasStage = dynamic(()=> import("@/components/CanvasStage"), { ssr: false })
export default function Page(){ return <main className="p-6"><CanvasStage/></main> }
