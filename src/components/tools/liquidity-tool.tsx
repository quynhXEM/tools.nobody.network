"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useUserWallet } from "@/app/commons/UserWalletContext"

export function LiquidityTool() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { isConnected } = useUserWallet()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    action: "add",
    tokenA: "",
    tokenB: "",
    amountA: "",
    amountB: "",
    dex: "uniswap",
  })

  const handleProcess = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      setResult({
        action: formData.action,
        lpTokens: "1,234.56",
        poolShare: "0.15%",
        transactionHash: "0x987654321abcdef987654321abcdef987654321abcdef987654321abcdef",
        gasUsed: "987,654",
      })
      setIsProcessing(false)
      toast({
        title: `Liquidity ${formData.action === "add" ? "added" : "removed"} successfully!`,
        description: "Your liquidity operation has been completed",
      })
    }, 3500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Liquidity Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add">Add Liquidity</TabsTrigger>
              <TabsTrigger value="remove">Remove Liquidity</TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">DEX Platform</Label>
                <Select value={formData.dex} onValueChange={(value) => setFormData({ ...formData, dex: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uniswap">Uniswap V3</SelectItem>
                    <SelectItem value="sushiswap">SushiSwap</SelectItem>
                    <SelectItem value="pancakeswap">PancakeSwap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Token A Address</Label>
                  <Input
                    placeholder="0x..."
                    value={formData.tokenA}
                    onChange={(e) => setFormData({ ...formData, tokenA: e.target.value })}
                    className="bg-slate-700 border-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Amount A</Label>
                  <Input
                    placeholder="0.0"
                    value={formData.amountA}
                    onChange={(e) => setFormData({ ...formData, amountA: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Token B Address</Label>
                  <Input
                    placeholder="0x..."
                    value={formData.tokenB}
                    onChange={(e) => setFormData({ ...formData, tokenB: e.target.value })}
                    className="bg-slate-700 border-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Amount B</Label>
                  <Input
                    placeholder="0.0"
                    value={formData.amountB}
                    onChange={(e) => setFormData({ ...formData, amountB: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="remove" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">LP Token Address</Label>
                <Input placeholder="0x..." className="bg-slate-700 border-slate-600 font-mono" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Amount to Remove (%)</Label>
                <Input placeholder="100" className="bg-slate-700 border-slate-600" />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleProcess} disabled={isProcessing || !isConnected} className="w-full crypto-gradient">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `${formData.action === "add" ? "Add" : "Remove"} Liquidity`
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Operation Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!result && !isProcessing && (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configure your liquidity operation to see results</p>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
              <p className="text-slate-300">Processing liquidity operation...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Operation Successful!</span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-slate-400 text-sm">Transaction Hash</Label>
                  <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                    {result.transactionHash}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400 text-sm">LP Tokens</Label>
                    <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{result.lpTokens}</div>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-sm">Pool Share</Label>
                    <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{result.poolShare}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
