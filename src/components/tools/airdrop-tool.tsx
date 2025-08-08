"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, Upload } from "lucide-react"
import { useUserWallet } from "@/app/commons/UserWalletContext"

export function AirdropTool() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { isConnected } = useUserWallet()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    tokenAddress: "",
    totalAmount: "",
    recipientList: "",
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
      const recipients = formData.recipientList.split("\n").filter((line) => line.trim()).length
      setResult({
        merkleRoot: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        totalRecipients: recipients,
        contractAddress: "0x123456789abcdef123456789abcdef123456789ab",
        claimUrl: "https://airdrop.example.com/claim/abc123",
      })
      setIsProcessing(false)
      toast({
        title: "Airdrop created successfully!",
        description: `Merkle tree generated for ${recipients} recipients`,
      })
    }, 4000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Airdrop Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tokenAddress" className="text-slate-300">
              Token Contract Address
            </Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={formData.tokenAddress}
              onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
              className="bg-slate-700 border-slate-600 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount" className="text-slate-300">
              Total Airdrop Amount
            </Label>
            <Input
              id="totalAmount"
              placeholder="1000000"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientList" className="text-slate-300">
              Recipient List
              <span className="text-slate-400 text-sm ml-2">(address,amount per line)</span>
            </Label>
            <Textarea
              id="recipientList"
              placeholder="0x1234...,100&#10;0x5678...,200&#10;0x9abc...,150"
              value={formData.recipientList}
              onChange={(e) => setFormData({ ...formData, recipientList: e.target.value })}
              className="bg-slate-700 border-slate-600 font-mono h-40"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Download Template
            </Button>
          </div>

          <Button onClick={handleProcess} disabled={isProcessing || !isConnected} className="w-full crypto-gradient">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Airdrop...
              </>
            ) : (
              "Create Airdrop"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Airdrop Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!result && !isProcessing && (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configure your airdrop to see results</p>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
              <p className="text-slate-300">Generating merkle tree...</p>
              <p className="text-sm text-slate-400 mt-2">Creating airdrop contract</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Airdrop Created!</span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-slate-400 text-sm">Merkle Root</Label>
                  <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                    {result.merkleRoot}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400 text-sm">Contract Address</Label>
                  <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                    {result.contractAddress}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400 text-sm">Claim URL</Label>
                  <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                    {result.claimUrl}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400 text-sm">Total Recipients</Label>
                  <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{result.totalRecipients}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Download Proofs
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Share Claim Link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
