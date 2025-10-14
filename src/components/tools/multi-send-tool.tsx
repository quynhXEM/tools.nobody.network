"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Wallet, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ChainConfigCard } from "@/views/tools/mutisend/chain-config-card"
import { ManualTransferForm } from "@/views/tools/mutisend/manual-transfer-form"
import { AutoGenerateForm } from "@/views/tools/mutisend/auto-generate-form"
import { WalletList } from "@/views/tools/mutisend/wallet-list"
import { ShortenAddress } from "@/libs/utils"

export interface WalletEntry {
  id: string
  address: string
  amount: number
}

export interface ChainConfig {
  chainId: string
  coinType: "coin" | "token"
  contractAddress?: string
  symbol?: string
}

export function MultiSendTool() {
  const t = useTranslations()
  const [wallets, setWallets] = useState<WalletEntry[]>([])
  const [chainConfig, setChainConfig] = useState<ChainConfig | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  const addWallet = (address: string, amount: number) => {
    const newWallet: WalletEntry = {
      id: Math.random().toString(36).substr(2, 9),
      address,
      amount,
    }
    setWallets((prev) => [...prev, newWallet])
  }

  const addMultipleWallets = (newWallets: Omit<WalletEntry, "id">[]) => {
    const walletsWithIds = newWallets.map((wallet) => ({
      ...wallet,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setWallets(walletsWithIds)
  }

  const removeWallet = (id: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== id))
  }

  const clearWallets = () => {
    setWallets([])
  }

  const handleConfigConfirm = (config: ChainConfig) => {
    setChainConfig(config)
    setIsConfigured(true)
  }

  const handleEditConfig = () => {
    setIsConfigured(false)
    setWallets([])
  }

  const getChainDisplayName = (chain: string) => {
    const names: Record<string, string> = {
      ethereum: "Ethereum",
      bsc: "BSC",
      polygon: "Polygon",
      arbitrum: "Arbitrum",
      optimism: "Optimism",
      avalanche: "Avalanche",
      solana: "Solana",
    }
    return names[chain] || chain
  }

  return (
    <div className="space-y-6 grid">
      <div className="space-y-6">
        {!isConfigured ? (
          <ChainConfigCard onConfirm={handleConfigConfirm} initialConfig={chainConfig || undefined} isEditing={isConfigured} />
        ) : (
          <div className="flex items-center justify-between border-1 border-slate-400 p-2 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">{t("multi_send.titles.current_configuration")}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {getChainDisplayName(chainConfig!.chainId)}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {chainConfig!.coinType === "coin" ? t("multi_send.labels.native_coin") : t("multi_send.labels.token_simple")}
                  </Badge>
                  {chainConfig!.contractAddress && (
                    <Badge variant="secondary" className="text-sm font-mono">
                      {ShortenAddress(chainConfig!.contractAddress)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" className="crypto-gradient" size="sm" onClick={handleEditConfig}>
              <Edit className="mr-2 h-4 w-4" />
              {t("multi_send.buttons.edit_configuration")}
            </Button>
          </div>
        )}

        {isConfigured && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Card className="p-6 text-white bg-slate-800/50 border-slate-700">
                <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6" >
                  <TabsTrigger value="manual" className="data-[state=active]:bg-blue-500">{t("multi_send.tabs.manual_entry")}</TabsTrigger>
                  <TabsTrigger value="auto" className="data-[state=active]:bg-blue-500">{t("multi_send.tabs.auto_generate")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4">
                    <ManualTransferForm onAddWallet={addWallet} />
                  </TabsContent>

                  <TabsContent value="auto" className="space-y-4">
                    <AutoGenerateForm onGenerateWallets={addMultipleWallets} />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            <div>
              {chainConfig && (
                <WalletList wallets={wallets} onRemoveWallet={removeWallet} onClearAll={clearWallets} chainConfig={chainConfig} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
