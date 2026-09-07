"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Simple context to control the global command palette
type SearchContextType = {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

export const SearchContext = React.createContext<SearchContextType>({
  isOpen: false,
  setIsOpen: () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SearchContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
      </SearchContext.Provider>
    </NextThemesProvider>
  )
}
