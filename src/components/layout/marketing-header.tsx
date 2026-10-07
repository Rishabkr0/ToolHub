"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Globe } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SearchTrigger } from "@/components/ui/search-trigger"

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="fixed top-0 w-full z-40 bg-background border-b-[3px] border-on-background neubrutal-shadow">
      <div className="h-20 w-full px-4 lg:px-lg flex items-center justify-between gap-md">
        <div className="flex items-center flex-1 gap-8">
          <div className="flex items-center gap-sm min-w-max z-50">
            <Link href="/" className="font-display-lg text-display-lg text-[24px] lg:text-[32px]">ToolHub</Link>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md relative">
            <SearchTrigger placeholder="Search for tools... (Cmd+K)" />
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-md">
          <Link href="/categories" className="font-label-bold text-label-bold text-on-surface-variant hover:text-on-surface transition-colors">Categories</Link>
          <Link href="/popular" className="font-label-bold text-label-bold text-on-surface-variant hover:text-on-surface transition-colors">Popular</Link>
          <Link href="/ai-tools" className="font-label-bold text-label-bold text-on-surface-variant hover:text-on-surface transition-colors">AI Tools</Link>
          <Link href="/developer" className="font-label-bold text-label-bold text-on-surface-variant hover:text-on-surface transition-colors">Developer</Link>
        </nav>

        <div className="flex items-center gap-sm z-50">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center gap-1 px-xs py-1 border-[3px] border-on-background rounded-lg cursor-pointer">
            <Globe className="w-4 h-4" />
            <span className="text-label-sm font-label-sm">EN</span>
          </div>
          
          <Link 
            href="/dashboard"
            className="hidden sm:flex px-md h-10 items-center bg-primary-container text-on-primary-container font-label-bold rounded-lg border-[3px] border-on-background neubrutal-shadow neubrutal-hover uppercase tracking-wider"
          >
            Dashboard
          </Link>

          <button 
            className="xl:hidden p-xs rounded-lg border-[3px] border-on-background"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-background border-b-[3px] border-on-background flex flex-col p-4 shadow-xl">
          <div className="mb-4">
            <SearchTrigger placeholder="Search for tools..." />
          </div>
          <Link href="/categories" className="py-2 font-label-bold text-on-surface-variant border-b border-surface-variant" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
          <Link href="/popular" className="py-2 font-label-bold text-on-surface-variant border-b border-surface-variant" onClick={() => setMobileMenuOpen(false)}>Popular</Link>
          <Link href="/ai-tools" className="py-2 font-label-bold text-on-surface-variant border-b border-surface-variant" onClick={() => setMobileMenuOpen(false)}>AI Tools</Link>
          <Link href="/developer" className="py-2 font-label-bold text-on-surface-variant border-b border-surface-variant" onClick={() => setMobileMenuOpen(false)}>Developer</Link>
          <Link href="/dashboard" className="py-2 font-label-bold text-primary mt-2" onClick={() => setMobileMenuOpen(false)}>Go to Dashboard</Link>
        </div>
      )}
    </header>
  )
}
