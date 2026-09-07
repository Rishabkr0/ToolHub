import * as React from "react"
import Link from "next/link"
import { Share2, Code, MessageSquare } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-surface-container border-t-[3px] border-on-background pt-xl pb-lg">
      <div className="w-full px-lg grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-lg mb-xl">
        <div>
          <h4 className="font-headline-md text-headline-md mb-md">Categories</h4>
          <ul className="space-y-xs">
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Documents</li>
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Images</li>
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Video</li>
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">AI & ML</li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline-md text-headline-md mb-md">Company</h4>
          <ul className="space-y-xs">
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">About Us</li>
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Careers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline-md text-headline-md mb-md">Resources</h4>
          <ul className="space-y-xs">
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Blog</li>
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Documentation</li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline-md text-headline-md mb-md">Legal</h4>
          <ul className="space-y-xs">
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Privacy</li>
            <li className="text-body-md text-on-surface-variant hover:text-on-surface cursor-pointer">Terms</li>
          </ul>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <h4 className="font-headline-md text-headline-md mb-md">Social</h4>
          <div className="flex gap-sm">
            <Link href="#" className="w-10 h-10 border-[3px] border-on-background bg-secondary-container flex items-center justify-center rounded-lg shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#111111] transition-all">
              <Share2 className="text-on-secondary-container w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 border-[3px] border-on-background bg-primary-container flex items-center justify-center rounded-lg shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#111111] transition-all">
              <Code className="text-on-primary-container w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 border-[3px] border-on-background bg-[#b8e0ff] flex items-center justify-center rounded-lg shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#111111] transition-all">
              <MessageSquare className="text-[#006691] w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full px-lg pt-md border-t-[3px] border-on-background/10 text-center text-label-sm font-label-sm text-on-surface-variant">
        © 2026 ToolHub. Made with bold precision.
      </div>
    </footer>
  )
}
