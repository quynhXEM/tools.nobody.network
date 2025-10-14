"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import { checkTokenIsValid } from "@/libs/token"
import { toast } from "@/hooks/use-toast"

interface ChainConfig {
  chainId: string
  coinType: "coin" | "token"
  contractAddress?: string
  symbol?: string
}

interface ChainConfigCardProps {
  onConfirm: (config: ChainConfig) => void
  initialConfig?: ChainConfig
  isEditing?: boolean
}

export function ChainConfigCard({ onConfirm, initialConfig, isEditing }: ChainConfigCardProps) {
  const t = useTranslations()
  const { chain } = useAppMetadata()
  const { getChainInfo } = useUserWallet()
  const [chainId, setChainId] = useState(initialConfig?.chainId || "")
  const [coinType, setCoinType] = useState<"coin" | "token">(initialConfig?.coinType || "coin")
  const [contractAddress, setContractAddress] = useState(initialConfig?.contractAddress || "")

  const handleConfirm = async () => {
    if (!chainId) return

    const config: ChainConfig = {
      chainId,
      coinType,
      symbol: "",
    }

    if (coinType === "token" && contractAddress) {
      const checkToken = await checkTokenIsValid({ tokenAddress: contractAddress, rpc: getChainInfo(chainId).chain_id.rpc_url, chainId: Number(chainId) })
      if (!checkToken) {
        toast({
          title: "Error",
          description: "Invalid token contract address",
          variant: "destructive",
        })
        return;
      };
      config.contractAddress = contractAddress
      config.symbol = checkToken
    }

    onConfirm(config)
  }

  const isValid = chainId && (coinType === "coin" || (coinType === "token" && contractAddress))

  return (
    <Card className="p-6 border-2 bg-slate-800/50 border-slate-700 text-white">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg ">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Blockchain Configuration</h2>
            <p className="text-sm ">
              {isEditing ? "Update your blockchain settings" : "Select chain and token type to begin"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="chainId">Select Chain</Label>
            <Select value={String(chainId)} onValueChange={setChainId}>
              <SelectTrigger id="chainId" className="w-full text-white bg-gray-700">
                <SelectValue placeholder={t("deploy_token.labels.select_chain")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                {chain.map((opt: any) => (
                  <SelectItem key={opt.chain_id.id} value={String(opt.chain_id.id)}>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${opt.chain_id.icon}/ids-coin.svg`} alt={opt.chain_id.name} className="w-4 h-4 mr-2" />
                    {opt.chain_id.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coinType">Coin/Token Type</Label>
            <Select value={coinType} onValueChange={(value) => setCoinType(value as "coin" | "token")} >
              <SelectTrigger id="coinType" className="w-full text-white bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="coin">Native Coin</SelectItem>
                <SelectItem value="token">Token (ERC-20/BEP-20)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {coinType === "token" && (
          <div className="space-y-2">
            <Label htmlFor="contract">Token Contract Address</Label>
            <Input
              id="contract"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        )}

        <Button onClick={handleConfirm} disabled={!isValid} className="w-full crypto-gradient" size="lg">
          <CheckCircle className="mr-2 h-5 w-5" />
          {isEditing ? "Update Configuration" : "Confirm & Continue"}
        </Button>
      </div>
    </Card>
  )
}
