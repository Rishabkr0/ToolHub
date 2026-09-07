import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Moon, Sun } from "lucide-react"

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-16 border-b-[3px] border-on-background bg-surface-container-low px-4 flex items-center justify-between neubrutal-shadow z-40 sticky top-0">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-label-bold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to ToolHub
        </Link>
        <div className="font-display-lg text-[20px] text-on-background">
          Workspace
        </div>
        <div className="w-[100px]" /> {/* Spacer to center the title */}
      </header>
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
