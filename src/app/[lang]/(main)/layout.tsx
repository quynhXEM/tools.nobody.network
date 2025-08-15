"use client"

import { Footer } from "@/components/footer"
import { UnifiedHeader } from "@/components/unified-header"


export default function Layout({ children }: { children: React.ReactNode }) {
    return <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            <UnifiedHeader />
            {children}
            <Footer />
        </div>
    </>
}