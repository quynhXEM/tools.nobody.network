"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Menu, X } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { useTranslations } from "next-intl"

const tools = [
  { id: "token-deploy", nameKey: "token.deploy" },
  { id: "transaction-decoder", nameKey: "tx.decoder" },
  { id: "multi-send", nameKey: "multi.send" },
  { id: "liquidity-manager", nameKey: "liquidity.manager" },
  { id: "airdrop-manager", nameKey: "airdrop.manager" },
]

interface ToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const t = useTranslations()

  const handleToolChange = (toolId: string) => {
    router.push(`/tools/${toolId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>

                <Link href="/" className="flex items-center gap-3 text-white hover:text-slate-300">
                  <Logo className="w-8 h-8" />
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Crypto Tools</span>
                  </div>
                </Link>

                <div className="hidden md:block">
                  <Select onValueChange={handleToolChange}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                      <SelectValue placeholder={t("switch.tool")} />
                    </SelectTrigger>
                    <SelectContent>
                      {tools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {t(tool.nameKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4">
                <Select onValueChange={handleToolChange}>
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600">
                    <SelectValue placeholder={t("switch.tool")} />
                  </SelectTrigger>
                  <SelectContent>
                    {tools.map((tool) => (
                      <SelectItem key={tool.id} value={tool.id}>
                        {t(tool.nameKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-300">{description}</p>
          </div>

          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
