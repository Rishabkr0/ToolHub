"use client"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
        <div className="text-center p-xl">
          <h2 className="text-4xl font-bold mb-4 text-on-background">Critical Error</h2>
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-primary-container text-on-primary-container border-[3px] border-on-background rounded-lg font-bold neubrutal-shadow"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
