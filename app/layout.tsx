import "./globals.css"
export const metadata = {
  title: "Cope Station",
  description: "Instant copium quotes, tweet-ready."
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  )
}
