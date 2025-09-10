"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Send, Droplets, Gift, TrendingUp, Shield, Zap, Users, FileText, ArrowLeftRight } from 'lucide-react'
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useRouter } from "@/i18n/navigation"
import { toast } from "@/hooks/use-toast"
import DeployChainIcon from "@/res/DeployChainIcon"

const tools = [
  {
    id: "token-deploy",
    titleKey: "Token Deploy",
    descKey: "token.deploydec",
    icon: Coins,
    color: "from-blue-500 to-cyan-500",
    active: true
  },
  {
    id: "chain-builder",
    titleKey: "Chain Builder",
    descKey: "chainbuilder",
    icon: DeployChainIcon,
    color: "from-cyan-500 to-emerald-500",
    active: true
  },
  {
    id: "swap-crypto",
    titleKey: "Swap Crypto",
    descKey: "swap.desc",
    icon: ArrowLeftRight,
    color: "from-cyan-500 to-emerald-500",
    active: true
  },
  {
    id: "transaction-decoder",
    titleKey: "Transaction Decoder",
    descKey: "tx.desc",
    icon: FileText,
    color: "from-violet-500 to-purple-500",
    active: true
  },
  {
    id: "multi-send",
    titleKey: "Multi Send",
    descKey: "multi.desc",
    icon: Send,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "liquidity-manager",
    titleKey: "Liquidity Manager",
    descKey: "liquidity.desc",
    icon: Droplets,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "airdrop-manager",
    titleKey: "Airdrop Manager",
    descKey: "airdrop.desc",
    icon: Gift,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "price-tracker",
    titleKey: "Price Tracker",
    descKey: "price.desc",
    icon: TrendingUp,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "contract-verifier",
    titleKey: "Contract Verifier",
    descKey: "contract.desc",
    icon: Shield,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "gas-optimizer",
    titleKey: "Gas Optimizer",
    descKey: "gas.desc",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "holder-analyzer",
    titleKey: "Holder Analyzer",
    descKey: "holder.desc",
    icon: Users,
    color: "from-pink-500 to-rose-500",
  },
]

export function ToolsGrid() {
  const t = useTranslations()
  const router = useRouter()

  const navigate = (tool: any) => {
    if (tool.active) {
      router.push(`/tools/${tool.id}`)
    } else {
      toast({
        title: t("tool.notavailable"),
        description: t("tool.notavailabledescription"),
        variant: "default",
      })
    }
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => {
        const IconComponent = tool.icon
        return (
          <Card key={tool.id} onClick={() => navigate(tool)} className={cn(!tool.active && "opacity-50", "tool-card-hover bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full cursor-pointer")} >
            <CardContent className="flex flex-col justify-center items-center">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white text-lg font-semibold">{tool.titleKey}</h2>
              <CardDescription className="text-slate-400 text-sm leading-relaxed text-center">{t(tool.descKey)}</CardDescription>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
