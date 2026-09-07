"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  buttonText?: string
}

export function SearchBar({ className, onSearch, buttonText = "Search", ...props }: SearchBarProps) {
  return (
    <div className={cn("relative group w-full", className)}>
      <input
        className="w-full h-20 pl-xl pr-md text-[20px] font-body-lg rounded-2xl border-[3px] border-on-background bg-surface-container-lowest shadow-[6px_6px_0px_0px_#111111] focus:shadow-[8px_8px_0px_0px_#8656e9] focus:-translate-y-1 focus:-translate-x-1 outline-none transition-all placeholder:text-on-surface-variant/50"
        {...props}
      />
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-on-surface-variant group-focus-within:text-secondary transition-colors" />
      <Button
        variant="secondary"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12"
        onClick={(e) => {
          e.preventDefault();
          if (onSearch) onSearch((e.currentTarget.previousElementSibling as HTMLInputElement)?.value || "")
        }}
      >
        {buttonText}
      </Button>
    </div>
  )
}
