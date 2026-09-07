"use client"

import * as React from "react"
import Link from "next/link"
import { NavItem } from "@/components/layout/nav-item"
import { Home, Compass, Zap, Code, Calculator, Star, Folder, User, Settings, LogOut } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r-[3px] border-on-background hidden lg:flex flex-col z-50">
      <div className="h-16 flex items-center px-lg border-b-[3px] border-on-background bg-background">
        <Link href="/" className="font-display-lg text-[24px]">ToolHub</Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-md px-sm flex flex-col gap-sm">
        <div className="mb-sm">
          <span className="px-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs block">Workspace</span>
          <div className="flex flex-col gap-1">
            <NavItem href="/dashboard" icon={Home} label="Dashboard" isActive />
            <NavItem href="/dashboard/recent" icon={Star} label="Recent Tools" />
            <NavItem href="/dashboard/collections" icon={Folder} label="Collections" />
          </div>
        </div>
        
        <div className="mb-sm">
          <span className="px-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs block">Library</span>
          <div className="flex flex-col gap-1">
            <NavItem href="/categories" icon={Compass} label="Browse All" />
            <NavItem href="/ai-tools" icon={Zap} label="AI Tools" />
            <NavItem href="/developer" icon={Code} label="Developer" />
            <NavItem href="/calculators" icon={Calculator} label="Calculators" />
          </div>
        </div>
      </div>
      
      <div className="p-sm border-t-[3px] border-on-background bg-surface-container">
        <div className="flex flex-col gap-1">
          <NavItem href="/profile" icon={User} label="Profile" />
          <NavItem href="/settings" icon={Settings} label="Settings" />
          <button className="flex items-center gap-3 px-sm py-2 rounded-lg font-label-bold text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors w-full text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
