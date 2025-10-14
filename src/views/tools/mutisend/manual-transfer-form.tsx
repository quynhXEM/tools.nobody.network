"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

interface ManualTransferFormProps {
  onAddWallet: (address: string, amount: number) => void
}

export function ManualTransferForm({ onAddWallet }: ManualTransferFormProps) {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const t = useTranslations()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!address.trim()) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.invalid_address"),
        variant: "destructive",
      })
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: t("multi_send.toast.error"),
        description: t("multi_send.toast.invalid_amount"),
        variant: "destructive",
      })
      return
    }

    onAddWallet(address, amountNum)
    setAddress("")
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">{t("multi_send.labels.wallet_address")}</Label>
        <Input
          id="address"
          placeholder={t("multi_send.placeholders.address")}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">{t("multi_send.labels.amount")}</Label>
        <Input
          id="amount"
          type="number"
          step="0.000001"
          placeholder={t("multi_send.placeholders.amount")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={!address.trim() || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0} className="w-full crypto-gradient">
        <Plus className="mr-2 h-4 w-4" />
        {t("multi_send.buttons.add_wallet")}
      </Button>
    </form>
  )
}
