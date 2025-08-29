import "./globals.css"
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: "Cope Station",
  description: "Instant copium quotes, tweet-ready."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 dark:bg-neutral-950">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
