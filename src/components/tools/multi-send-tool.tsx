"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from "next-intl"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import WalletConnect from "@/app/commons/WalletConnect"

export function MultiSendTool() {
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)
  const { isConnected } = useUserWallet()
  const { toast } = useToast()
  const t = useTranslations()

  const [formData, setFormData] = useState({
    tokenAddress: "",
    recipients: [{ address: "", amount: "" }],
  })

  const addRecipient = () => {
    setFormData({
      ...formData,
      recipients: [...formData.recipients, { address: "", amount: "" }],
    })
  }

  const removeRecipient = (index: number) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter((_, i) => i !== index),
    })
  }

  const updateRecipient = (index: number, field: "address" | "amount", value: string) => {
    const updated = formData.recipients.map((recipient, i) =>
      i === index ? { ...recipient, [field]: value } : recipient,
    )
    setFormData({ ...formData, recipients: updated })
  }

  const handleSend = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate sending process
    setTimeout(() => {
      setSendResult({
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        totalRecipients: formData.recipients.length,
        totalAmount: formData.recipients.reduce((sum, r) => sum + Number.parseFloat(r.amount || "0"), 0),
        gasUsed: "1,234,567",
        transactionCost: "0.0156 ETH",
      })
      setIsSending(false)
      toast({
        title: "Multi-send completed!",
        description: `Tokens sent to ${formData.recipients.length} recipients`,
      })
    }, 4000)
  }

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Wallet Connection</h3>
              <p className="text-slate-400 text-sm">Connect your wallet to send tokens</p>
            </div>
            <WalletConnect />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("multi.config")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tokenAddress" className="text-slate-300">
                {t("contract.address")}
              </Label>
              <Input
                id="tokenAddress"
                placeholder="0x..."
                value={formData.tokenAddress}
                onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
                className="bg-slate-700 border-slate-600 font-mono"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">{t("recipients")}</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t("add")}
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {formData.recipients.map((recipient, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-slate-400 text-xs">{t("address")}</Label>
                      <Input
                        placeholder="0x..."
                        value={recipient.address}
                        onChange={(e) => updateRecipient(index, "address", e.target.value)}
                        className="bg-slate-700 border-slate-600 font-mono text-sm"
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-slate-400 text-xs">{t("amount")}</Label>
                      <Input
                        placeholder="0.0"
                        value={recipient.amount}
                        onChange={(e) => updateRecipient(index, "amount", e.target.value)}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    {formData.recipients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-sm text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>{t("total.recipients")}:</span>
                  <span>{formData.recipients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("total.amount")}:</span>
                  <span>
                    {formData.recipients.reduce((sum, r) => sum + Number.parseFloat(r.amount || "0"), 0).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleSend} disabled={isSending || !isConnected} className="w-full crypto-gradient">
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("sending")}
                </>
              ) : (
                t("multi.tokens")
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("transaction.results")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!sendResult && !isSending && (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Configure recipients and click send to see results</p>
              </div>
            )}

            {isSending && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
                <p className="text-slate-300">Processing multi-send transaction...</p>
                <p className="text-sm text-slate-400 mt-2">Distributing tokens to all recipients</p>
              </div>
            )}

            {sendResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{t("multisend.successful")}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400 text-sm">Transaction Hash</Label>
                    <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                      {sendResult.transactionHash}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400 text-sm">Recipients</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">
                        {sendResult.totalRecipients}
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm">Total Amount</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{sendResult.totalAmount}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400 text-sm">Gas Used</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">{sendResult.gasUsed}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm">Cost</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200">
                        {sendResult.transactionCost}
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
    </div>
  )
}
