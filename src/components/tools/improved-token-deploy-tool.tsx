"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslations } from "next-intl"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import WalletConnect from "@/app/commons/WalletConnect"

export function ImprovedTokenDeployTool() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<any>(null)
  const { isConnected } = useUserWallet()
  const t = useTranslations()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    network: "ethereum",
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    description: "",
  })

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "")
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleTotalSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    setFormData({ ...formData, totalSupply: formatted })
  }

  const handleDeploy = async () => {
    if (!isConnected) {
      toast({
        title: t("wallet.not.connected"),
        description: t("connect.wallet.first"),
        variant: "destructive",
      })
      return
    }

    setIsDeploying(true)

    // Simulate deployment process
    setTimeout(() => {
      setDeployResult({
        contractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1",
        transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        gasUsed: "2,145,678",
        deploymentCost: "0.0234 ETH",
        network: formData.network,
        tokenName: formData.name,
        tokenSymbol: formData.symbol,
        totalSupply: formData.totalSupply.replace(/,/g, ""), // Remove commas for actual value
      })
      setIsDeploying(false)
      toast({
        title: t("token.deployed.success"),
        description: "Token của bạn đã được deploy lên blockchain",
      })
    }, 3000)
  }

  // Show results if dev override is enabled
  useEffect(() => {
    // if (isTokenDeployedOverride && !deployResult) {
    //   setDeployResult({
    //     contractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1",
    //     transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    //     gasUsed: "2,145,678",
    //     deploymentCost: "0.0234 ETH",
    //     network: "ethereum",
    //     tokenName: "Demo Token",
    //     tokenSymbol: "DEMO",
    //     totalSupply: "1000000",
    //   })
    // } else if (!isTokenDeployedOverride && deployResult) {
    //   setDeployResult(null)
    // }
  }, [deployResult])

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Wallet Connection</h3>
              <p className="text-slate-400 text-sm">Connect your wallet to deploy tokens</p>
            </div>
            <WalletConnect />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("token.configuration")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Network - moved to top */}
            <div className="space-y-2">
              <Label htmlFor="network" className="text-slate-300">
                {t("token.network")}
              </Label>
              <Select value={formData.network} onValueChange={(value) => setFormData({ ...formData, network: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                  <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="sepolia">Sepolia Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                {t("token.name")}
              </Label>
              <Input
                id="name"
                placeholder="My Awesome Token"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-slate-300">
                {t("token.symbol")}
              </Label>
              <Input
                id="symbol"
                placeholder="MAT"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSupply" className="text-slate-300">
                {t("token.totalsupply")}
              </Label>
              <Input
                id="totalSupply"
                placeholder="1,000,000"
                value={formData.totalSupply}
                onChange={handleTotalSupplyChange}
                className="bg-slate-700 border-slate-600"
              />
              <p className="text-xs text-slate-400">
                {t("token.actual.value")}: {formData.totalSupply.replace(/,/g, "")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decimals" className="text-slate-300">
                {t("token.decimals")}
              </Label>
              <Select value={formData.decimals} onValueChange={(value) => setFormData({ ...formData, decimals: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18 ({t("token.standard")})</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="description" className="text-slate-300">
                  {t("token.description")} ({t("token.optional")})
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Mô tả này chỉ để ghi chú cá nhân, không được lưu trên blockchain. Metadata token (tên, ký hiệu,
                        decimals) mới được lưu trong smart contract.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="description"
                placeholder={t("token.placeholder")}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600"
                rows={3}
              />
              <p className="text-xs text-slate-400">💡 Mô tả này chỉ để ghi chú, không được deploy lên blockchain</p>
            </div>

            <Button onClick={handleDeploy} disabled={isDeploying || !isConnected} className="w-full crypto-gradient">
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("token.deploying")}
                </>
              ) : (
                t("token.deploy")
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("deployment.results")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!deployResult && !isDeploying && (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("token.configuration")}</p>
              </div>
            )}

            {isDeploying && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
                <p className="text-slate-300">{t("deploying.token")}</p>
                <p className="text-sm text-slate-400 mt-2">Quá trình này có thể mất vài phút</p>
              </div>
            )}

            {deployResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{t("deployment.successful")}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400 text-sm">Mạng</Label>
                    <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200 capitalize">
                      {deployResult.network}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-400 text-sm">{t("contract.address")}</Label>
                    <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                      {deployResult.contractAddress}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-400 text-sm">{t("transaction.hash")}</Label>
                    <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                      {deployResult.transactionHash}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400 text-sm">{t("gas.used")}</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{deployResult.gasUsed}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm">{t("cost")}</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">
                        {deployResult.deploymentCost}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">{t("token.info")}</h4>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div className="flex justify-between">
                        <span>{t("name")}:</span>
                        <span className="text-slate-200">{deployResult.tokenName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("symbol")}:</span>
                        <span className="text-slate-200">{deployResult.tokenSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng cung:</span>
                        <span className="text-slate-200">{formatNumber(deployResult.totalSupply)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  {t("view.explorer")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
