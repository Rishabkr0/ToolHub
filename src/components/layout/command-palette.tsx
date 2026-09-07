"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search, FileText, ImageIcon, Scissors, Settings, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { SearchContext } from "@/providers"
import { useRouter } from "next/navigation"

export function CommandPalette() {
  const { setTheme } = useTheme()
  const { isOpen, setIsOpen } = React.useContext(SearchContext)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4" onClick={() => setIsOpen(false)}>
      <div className="w-[90vw] sm:w-[600px] max-w-full bg-surface-container-lowest rounded-xl border-[3px] border-on-background neubrutal-shadow overflow-hidden" onClick={e => e.stopPropagation()}>
        <Command className="w-full h-full flex flex-col bg-surface-container-lowest" label="Global Command Menu">
          <div className="flex items-center border-b-[3px] border-on-background px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-5 w-5 shrink-0 text-on-surface-variant" />
            <Command.Input 
              autoFocus
              className="flex h-12 w-full bg-transparent py-3 text-body-lg text-on-surface outline-none placeholder:text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-50" 
              placeholder="Type a command or search tools..." 
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-body-md text-on-surface-variant">No results found.</Command.Empty>
            
            <Command.Group heading="Tools" className="text-label-bold text-on-surface-variant px-2 py-1 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1 mt-2">
              <Command.Item onSelect={() => { router.push('/tool/merge-pdf'); setIsOpen(false) }} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface-container-high cursor-pointer aria-selected:bg-surface-container-high text-body-md text-on-surface">
                <FileText className="h-4 w-4" /> Merge PDF
              </Command.Item>
              <Command.Item onSelect={() => { router.push('/tool/remove-background'); setIsOpen(false) }} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface-container-high cursor-pointer aria-selected:bg-surface-container-high text-body-md text-on-surface">
                <ImageIcon className="h-4 w-4" /> Remove Background
              </Command.Item>
              <Command.Item onSelect={() => { router.push('/tool/trim-video'); setIsOpen(false) }} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface-container-high cursor-pointer aria-selected:bg-surface-container-high text-body-md text-on-surface">
                <Scissors className="h-4 w-4" /> Trim Video
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Theme" className="text-label-bold text-on-surface-variant px-2 py-1 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1 mt-2 border-t-[3px] border-on-background pt-2">
              <Command.Item onSelect={() => { setTheme("light"); setIsOpen(false) }} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface-container-high cursor-pointer aria-selected:bg-surface-container-high text-body-md text-on-surface">
                <Sun className="h-4 w-4" /> Light Mode
              </Command.Item>
              <Command.Item onSelect={() => { setTheme("dark"); setIsOpen(false) }} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface-container-high cursor-pointer aria-selected:bg-surface-container-high text-body-md text-on-surface">
                <Moon className="h-4 w-4" /> Dark Mode
              </Command.Item>
              <Command.Item onSelect={() => { setTheme("system"); setIsOpen(false) }} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface-container-high cursor-pointer aria-selected:bg-surface-container-high text-body-md text-on-surface">
                <Monitor className="h-4 w-4" /> System
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
