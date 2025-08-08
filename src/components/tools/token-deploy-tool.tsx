"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useUserWallet } from "@/app/commons/UserWalletContext"

export function TokenDeployTool() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<any>(null)
  const { isConnected } = useUserWallet()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    network: "ethereum",
    description: "",
  })

  const handleDeploy = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
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
      })
      setIsDeploying(false)
      toast({
        title: "Token deployed successfully!",
        description: "Your token has been deployed to the blockchain",
      })
    }, 3000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Token Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Token Name
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
              Token Symbol
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
              Total Supply
            </Label>
            <Input
              id="totalSupply"
              placeholder="1000000"
              value={formData.totalSupply}
              onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimals" className="text-slate-300">
              Decimals
            </Label>
            <Select value={formData.decimals} onValueChange={(value) => setFormData({ ...formData, decimals: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18">18 (Standard)</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="network" className="text-slate-300">
              Network
            </Label>
            <Select value={formData.network} onValueChange={(value) => setFormData({ ...formData, network: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your token..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <Button onClick={handleDeploy} disabled={isDeploying || !isConnected} className="w-full crypto-gradient">
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy Token"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Deployment Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!deployResult && !isDeploying && (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configure your token and click deploy to see results</p>
            </div>
          )}

          {isDeploying && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
              <p className="text-slate-300">Deploying your token...</p>
              <p className="text-sm text-slate-400 mt-2">This may take a few minutes</p>
            </div>
          )}

          {deployResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Deployment Successful!</span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-slate-400 text-sm">Contract Address</Label>
                  <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                    {deployResult.contractAddress}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400 text-sm">Transaction Hash</Label>
                  <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                    {deployResult.transactionHash}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400 text-sm">Gas Used</Label>
                    <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{deployResult.gasUsed}</div>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-sm">Cost</Label>
                    <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">
                      {deployResult.deploymentCost}
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View on Explorer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
