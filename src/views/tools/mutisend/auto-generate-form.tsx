"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { genarateWallet } from "@/libs/token"

interface AutoGenerateFormProps {
  onGenerateWallets: (wallets: { address: string; amount: number }[]) => void
}

export function AutoGenerateForm({ onGenerateWallets }: AutoGenerateFormProps) {
  const [walletCount, setWalletCount] = useState("2")
  const [totalAmount, setTotalAmount] = useState("100")
  const [minAmount, setMinAmount] = useState("20")
  const [maxAmount, setMaxAmount] = useState("40")
  const [seedPhrase, setSeedPhrase] = useState("")
  const { toast } = useToast()
  const t = useTranslations()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    const count = Number.parseInt(walletCount)
    const total = Number.parseFloat(totalAmount)
    const min = Number.parseFloat(minAmount)
    const max = Number.parseFloat(maxAmount)

    if (isNaN(count) || count <= 0) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.invalid_wallet_count"),
        variant: "destructive",
      })
      return
    }

    if (isNaN(total) || total <= 0) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.invalid_total"),
        variant: "destructive",
      })
      return
    }

    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min > max) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.invalid_min_max"),
        variant: "destructive",
      })
      return
    }

    if (min * count > total) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.total_too_small"),
        variant: "destructive",
      })
      return
    }


    // Generate random amounts within range
    const result = await genarateWallet({ number: count, seed: seedPhrase })
    if (!result) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.gen_failed"),
        variant: "destructive",
      })
      return
    }
    setSeedPhrase(result?.mnemonic || "")
    const wallets = [];
    let remaining = total

    for (let i = 0; i < count; i++) {
      let amount: number

      if (i === count - 1) {
        // Last wallet gets remaining amount
        amount = remaining
      } else {
        // Random amount between min and max, but not more than remaining
        const maxPossible = Math.min(max, remaining - min * (count - i - 1))
        amount = min + Math.random() * (maxPossible - min)
      }

      // Ensure amount is within bounds
      amount = Math.max(min, Math.min(max, amount))
      amount = Number.parseFloat(amount.toFixed(6))

      wallets.push({ ...result?.wallets?.[i], amount , mnemonic: result?.mnemonic})

      remaining -= amount
    }
    
    onGenerateWallets(wallets)

    toast({
      title: t("multi_send.toast.success"),
      description: t("multi_send.toast.generated", { count, total }),
    })
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="walletCount">{t("multi_send.labels.number_of_wallets")}</Label>
          <Input
            id="walletCount"
            type="number"
            placeholder={t("multi_send.placeholders.wallets")}
            value={walletCount}
            onChange={(e) => setWalletCount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAmount">{t("multi_send.labels.total")}</Label>
          <Input
            id="totalAmount"
            type="number"
            step="0.000001"
            placeholder={t("multi_send.placeholders.total")}
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minAmount">{t("multi_send.labels.min_per_wallet")}</Label>
          <Input
            id="minAmount"
            type="number"
            step="0.000001"
            placeholder={t("multi_send.placeholders.min")}
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxAmount">{t("multi_send.labels.max_per_wallet")}</Label>
          <Input
            id="maxAmount"
            type="number"
            step="0.000001"
            placeholder={t("multi_send.placeholders.max")}
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seedPhrase">{t("multi_send.labels.seed_phrase")}</Label>
        <div className="flex gap-2">
          <Textarea
            id="seedPhrase"
            placeholder={t("multi_send.placeholders.seed_phrase")}
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            className="font-mono text-sm resize-none"
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" className="w-full crypto-gradient">
        <Sparkles className="mr-2 h-4 w-4" />
        {t("multi_send.buttons.generate_wallets")}
      </Button>
    </form>
  )
}
