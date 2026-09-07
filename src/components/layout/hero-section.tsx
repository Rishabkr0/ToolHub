import * as React from "react"
import Link from "next/link"
import { ArrowRight, Shield, UserX, Zap, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full bg-background px-md lg:px-xl py-xl lg:py-[120px] border-b-[3px] border-on-background">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-xl lg:gap-xl">
        <div className="w-full lg:w-1/2 flex flex-col gap-lg items-start">
          <h1 className="font-display-lg text-display-lg lg:text-[72px] lg:leading-[1.05] text-on-background tracking-tighter max-w-[600px]">
            Everything you need. <br />
            <span className="text-on-surface-variant relative inline-block">
              All in one place.
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-primary opacity-50" fill="none" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
              </svg>
            </span>
          </h1>
          <p className="font-body-lg text-body-lg lg:text-[20px] text-on-surface-variant max-w-[500px]">
            Access hundreds of online tools instantly. 100% free, no login required, privacy-first.
          </p>
          <div className="flex flex-wrap items-center gap-md pt-sm">
            <Link href="#search" className="group relative inline-flex h-14 items-center justify-center px-8 bg-primary-container text-on-primary-container font-headline-md text-[18px] rounded-xl border-[3px] border-on-background shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all">
              Explore Tools
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="inline-flex h-14 items-center justify-center px-8 bg-surface-container-lowest text-on-surface font-headline-md text-[18px] rounded-xl border-[3px] border-on-background shadow-[4px_4px_0px_0px_#111111] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#111111] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all">
              How It Works
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md pt-lg mt-md border-t-[3px] border-on-background/20 w-full">
            <div className="flex items-center gap-2">
              <Shield className="text-secondary w-5 h-5" />
              <span className="font-label-bold text-label-bold text-on-surface">Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <UserX className="text-[#006590] w-5 h-5" />
              <span className="font-label-bold text-label-bold text-on-surface">No Login</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-primary w-5 h-5" />
              <span className="font-label-bold text-label-bold text-on-surface">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-error w-5 h-5" />
              <span className="font-label-bold text-label-bold text-on-surface">Always Free</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[500px]">
          <div className="absolute inset-0 bg-secondary-container rounded-3xl border-[3px] border-on-background shadow-[8px_8px_0px_0px_#111111] rotate-2 opacity-20"></div>
          <div className="absolute inset-0 bg-primary-container rounded-3xl border-[3px] border-on-background shadow-[8px_8px_0px_0px_#111111] -rotate-1 opacity-20"></div>
          <div className="relative w-full h-full bg-surface-container-lowest rounded-3xl border-[3px] border-on-background shadow-[8px_8px_0px_0px_#111111] overflow-hidden flex flex-col hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_#111111] transition-all duration-300">
            <div className="h-12 bg-surface-container-high border-b-[3px] border-on-background flex items-center px-md gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error border-[2px] border-on-background"></div>
                <div className="w-3 h-3 rounded-full bg-primary border-[2px] border-on-background"></div>
                <div className="w-3 h-3 rounded-full bg-secondary border-[2px] border-on-background"></div>
              </div>
              <div className="flex-1 ml-4 bg-surface-container-lowest h-6 rounded border-[2px] border-on-background flex items-center px-2">
                <Shield className="w-3 h-3 text-on-surface-variant" />
                <span className="font-label-sm text-[10px] text-on-surface-variant ml-2">toolhub.app</span>
              </div>
            </div>
            <div className="flex-1 p-md grid grid-cols-12 gap-md bg-surface-container-lowest">
              <div className="col-span-3 border-r-[3px] border-on-background pr-md flex flex-col gap-sm">
                <div className="h-8 bg-[#b8e0ff] rounded border-[2px] border-on-background w-full opacity-60"></div>
                <div className="h-8 bg-secondary-container rounded border-[2px] border-on-background w-3/4 opacity-40"></div>
                <div className="h-8 bg-primary-container rounded border-[2px] border-on-background w-5/6 opacity-40"></div>
              </div>
              <div className="col-span-9 flex flex-col gap-md">
                <div className="h-24 bg-surface-container border-[3px] border-on-background rounded-xl p-sm flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#111_2px,transparent_2px)] [background-size:16px_16px]"></div>
                  <span className="font-headline-lg text-on-surface-variant opacity-20 relative z-10">DROP FILE HERE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
