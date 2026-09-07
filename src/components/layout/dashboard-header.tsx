"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Menu, Bell, User } from "lucide-react"
import { SearchContext } from "@/providers"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SearchTrigger } from "@/components/ui/search-trigger"

export function DashboardHeader() {
  const { setIsOpen } = React.useContext(SearchContext)

  return (
    <header className="fixed top-0 w-full z-40 bg-background border-b-[3px] border-on-background neubrutal-shadow lg:pl-64 transition-all">
      <div className="h-16 w-full px-4 flex items-center justify-between gap-md">
        
        {/* Mobile Logo & Menu */}
        <div className="flex lg:hidden items-center gap-3">
          <button className="p-1 rounded-md border-[2px] border-on-background">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/dashboard" className="font-display-lg text-[20px]">ToolHub</Link>
        </div>

        <div className="hidden sm:flex flex-1 max-w-xl relative">
          <SearchTrigger placeholder="Cmd+K to search..." />
        </div>
        
        {/* Mobile Search Icon */}
        <div className="flex sm:hidden flex-1 justify-end">
          <button onClick={() => setIsOpen(true)} className="p-2">
            <Search className="w-5 h-5 text-on-surface" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-[2px] border-on-background neubrutal-shadow cursor-pointer">
            <User className="w-4 h-4 text-on-primary-container" />
          </div>
        </div>
      </div>
    </header>
  )
}
