"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, useToast } from "@/hooks/use-toast"
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
import { Avatar, AvatarImage } from "../ui/avatar"
import { ethers } from "ethers"

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
  const { getChainInfo } = useUserWallet()
  const [wallets, setWallets] = useState<WalletEntry[]>([])
  const [chainConfig, setChainConfig] = useState<ChainConfig | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const chain = getChainInfo(chainConfig?.chainId || "")?.chain_id

  const addWallet = (address: string, amount: number) => {
    if (!ethers.isAddress(address)) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.address_invalid"),
        variant: "destructive",
      })
      return
    }
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

  return (
    <div className="space-y-6">
      {!isConfigured ? (
        <ChainConfigCard onConfirm={handleConfigConfirm} initialConfig={chainConfig || undefined} isEditing={isConfigured} />
      ) : (
        <div className="flex items-start flex-col border-1 border-slate-400 p-2 rounded-lg">
          <p className="text-sm font-medium text-white">{t("multi_send.titles.current_configuration")}:</p>
          <div className="flex flex-wrap space-x-2 space-y-2">
            <Badge variant="secondary" className="text-sm">
              <Avatar className="w-5 h-5">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${chain?.icon}`} />
              </Avatar>
              {chain?.name}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {chainConfig!.coinType === "coin" ? chain.symbol : "Token:" + chainConfig?.symbol}
            </Badge>
            {chainConfig!.contractAddress && (
              <Badge variant="secondary" className="text-sm font-mono">
                {ShortenAddress(chainConfig!.contractAddress)}
              </Badge>
            )}
            <Button variant="outline" className="crypto-gradient text-white" size="sm" onClick={handleEditConfig}>
              <Edit className="mr-2 h-4 w-4" />
              {t("multi_send.buttons.edit_configuration")}
            </Button>
          </div>
        </div>
      )}

      {isConfigured && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card className="p-6 text-white bg-slate-800/50 border-slate-700">
              <Tabs defaultValue="auto" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6" >
                  <TabsTrigger value="auto" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">{t("multi_send.tabs.auto_generate")}</TabsTrigger>
                  <TabsTrigger value="manual" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">{t("multi_send.tabs.manual_entry")}</TabsTrigger>
                </TabsList>
                <TabsContent value="auto" className="space-y-4">
                  <AutoGenerateForm onGenerateWallets={addMultipleWallets} />
                </TabsContent>
                <TabsContent value="manual" className="space-y-4">
                  <ManualTransferForm onAddWallet={addWallet} />
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
  )
}
