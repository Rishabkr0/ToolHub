"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => setMounted(true), [])

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-[3px] border-transparent hover:border-on-background hover:bg-surface-container-high transition-all neubrutal-hover"
      suppressHydrationWarning
      title="Toggle theme"
    >
      {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
