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
      <div className="flex items-center gap-2 w-full">
        <Button
          type="button"
          className="flex-2 text-black"
          variant="outline"
          onClick={() => {
            const header = "address,amount\n"
            const example = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,1.25\n"
            const blob = new Blob([header + example], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "multi-send-sample.csv"
            link.click()
            URL.revokeObjectURL(url)
          }}
        >
          {t("multi_send.buttons.download_csv_sample")}
        </Button>

        <label className="inline-flex flex-1">
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              // Kiểm tra định dạng file CSV theo MIME hoặc phần mở rộng
              const nameLower = file.name.toLowerCase()
              const isCsvByExt = nameLower.endsWith(".csv")
              const isCsvByMime = (file.type || "").toLowerCase().includes("csv") || file.type === "text/plain"
              if (!isCsvByExt && !isCsvByMime) {
                toast({
                  title: t("multi_send.toast.error"),
                  description: t("multi_send.toast.csv_invalid_type"),
                  variant: "destructive",
                })
                e.currentTarget.value = ""
                return
              }

              try {
                const text = await file.text()
                const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
                if (lines.length === 0) {
                  toast({
                    title: t("multi_send.toast.error"),
                    description: t("multi_send.toast.csv_empty"),
                    variant: "destructive",
                  })
                  return
                }

                // Bỏ header nếu có
                const dataLines = lines[0].toLowerCase().includes("address") && lines[0].includes("amount")
                  ? lines.slice(1)
                  : lines

                let successCount = 0
                let errorCount = 0
                for (const line of dataLines) {
                  const parts = line.split(",").map((p) => p.trim())
                  if (parts.length < 2) {
                    errorCount++
                    continue
                  }
                  const [addr, amtStr] = parts
                  const amt = Number.parseFloat(amtStr)
                  if (!addr || isNaN(amt) || amt <= 0) {
                    errorCount++
                    continue
                  }
                  onAddWallet(addr, Number.parseFloat(amt.toFixed(6)))
                  successCount++
                }

                if (successCount > 0) {
                  toast({
                    title: t("multi_send.toast.success"),
                    description: t("multi_send.toast.csv_imported", { count: successCount }),
                  })
                }
                if (errorCount > 0 && successCount === 0) {
                  toast({
                    title: t("multi_send.toast.error"),
                    description: t("multi_send.toast.csv_import_failed"),
                    variant: "destructive",
                  })
                } else if (errorCount > 0) {
                  toast({
                    title: t("multi_send.toast.warning"),
                    description: t("multi_send.toast.csv_import_partial", { count: errorCount }),
                  })
                }
              } catch (err) {
                toast({
                  title: t("multi_send.toast.error"),
                  description: t("multi_send.toast.csv_read_error"),
                  variant: "destructive",
                })
              } finally {
                e.currentTarget.value = ""
              }
            }}
          />
          <Button type="button" className="w-full" variant="secondary" onClick={() => (document.querySelector<HTMLInputElement>("input[type=file][accept='.csv,text/csv']")?.click?.())}>
            {t("multi_send.buttons.upload_csv")}
          </Button>
        </label>
      </div>
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
