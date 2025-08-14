"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, X, Home, Coins, FileText, Send, Droplets, Gift, TrendingUp, Shield, Zap, Users, ChevronDown } from 'lucide-react'
import { Logo } from "@/components/logo"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import LocaleDropdown from "@/app/commons/LocaleDropdown"
import { cn } from "@/libs/utils"
import { toast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const navigationItems = [
  {
    id: "home",
    nameKey: "Crypto Tools",
    icon: Logo,
    path: "/home",
    isLogo: true,
    active: true
  },
  {
    id: "token-deploy",
    nameKey: "Token Deploy",
    icon: Coins,
    path: "/tools/token-deploy",
    active: true
  },
  {
    id: "transaction-decoder",
    nameKey: "Transaction Decoder",
    icon: FileText,
    path: "/tools/transaction-decoder",
    active: true
  },
  {
    id: "multi-send",
    nameKey: "Multi Send",
    icon: Send,
    path: "/tools/multi-send",
  },
  {
    id: "liquidity-manager",
    nameKey: "Liquidity Manager",
    icon: Droplets,
    path: "/tools/liquidity-manager",
  },
  {
    id: "airdrop-manager",
    nameKey: "Airdrop Manager",
    icon: Gift,
    path: "/tools/airdrop-manager",
  },
  {
    id: "price-tracker",
    nameKey: "Price Tracker",
    icon: TrendingUp,
    path: "/tools/price-tracker",
  },
  {
    id: "contract-verifier",
    nameKey: "Contract Verifier",
    icon: Shield,
    path: "/tools/contract-verifier",
  },
  {
    id: "gas-optimizer",
    nameKey: "Gas Optimizer",
    icon: Zap,
    path: "/tools/gas-optimizer",
  },
  {
    id: "holder-analyzer",
    nameKey: "Holder Analyzer",
    icon: Users,
    path: "/tools/holder-analyzer",
  },
]

export function UnifiedHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()

  // Find current page
  const currentItem = navigationItems.find(item => item.path === pathname) || navigationItems[0]

  const handleNavigation = (itemId: string) => {
    const item = navigationItems.find(nav => nav.id === itemId)
    if (item && item?.active) {
      router.push(item.path)
    } else {
      toast({
        title: t("tool.notavailable"),
        description: t("tool.notavailabledescription"),
        variant: "default",
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation Dropdown */}
          <div className="flex items-center gap-4">
            {/* <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button> */}

            {/* Desktop Navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={"sm"} className="cursor-pointer outline-none border-none hover:bg-gray-400/40 text-white">
                  {currentItem.isLogo ? (
                    <Logo className="w-4 h-4" />
                  ) : (
                    <currentItem.icon className="w-4 h-4" />
                  )}
                  &nbsp;{currentItem.nameKey}&nbsp;
                  <ChevronDown className="text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="">
                {navigationItems.map((l) => {
                  const IconComponent = l.icon
                  return (
                    <DropdownMenuItem
                      key={l.id}
                      onClick={() => handleNavigation(l.id)}
                      className={cn("flex items-center space-x-2 cursor-pointer", !l.active && "opacity-50")}
                    >
                      {l.isLogo ? (
                        <Logo className="w-4 h-4" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                      &nbsp;{l.nameKey}&nbsp;
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile - Show current page title */}
            {/* <div className="md:hidden flex items-center gap-2 text-white">
              {currentItem.isLogo ? (
                <Logo className="w-6 h-6" />
              ) : (
                <currentItem.icon className="w-6 h-6" />
              )}
              <span className="font-semibold">{currentItem.nameKey}</span>
            </div> */}
          </div>

          {/* Right side - Language Switcher only */}
          <div className="flex items-center">
            <LocaleDropdown />
          </div>
        </div>

        {/* Mobile Menu */}
        {/* {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                const isActive = item.path === pathname
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                  >
                    {item.isLogo ? (
                      <Logo className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                    <span>{t(item.nameKey)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )} */}
      </div>
    </header>
  )
}
