"use client"

import type React from "react"
import { Footer } from "@/components/footer"
import { UnifiedHeader } from "@/components/unified-header"

interface SimplifiedToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function SimplifiedToolLayout({ title, description, children }: SimplifiedToolLayoutProps) {
  return (
    <div className="flex-1">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-300">{description}</p>
        </div>

        {children}
      </main>
    </div>
  )
}
