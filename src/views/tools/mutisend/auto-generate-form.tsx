"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AutoGenerateFormProps {
  onGenerateWallets: (wallets: { address: string; amount: number }[]) => void
}

export function AutoGenerateForm({ onGenerateWallets }: AutoGenerateFormProps) {
  const [walletCount, setWalletCount] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const { toast } = useToast()

  const generateSeedPhrase = () => {
    const words = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
      "account",
      "accuse",
      "achieve",
      "acid",
      "acoustic",
      "acquire",
      "across",
      "act",
      "action",
      "actor",
      "actress",
      "actual",
    ]
    const phrase = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" ")
    setSeedPhrase(phrase)
  }

  const generateRandomAddress = () => {
    const chars = "0123456789abcdef"
    let address = "0x"
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  }

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()

    const count = Number.parseInt(walletCount)
    const total = Number.parseFloat(totalAmount)
    const min = Number.parseFloat(minAmount)
    const max = Number.parseFloat(maxAmount)

    if (isNaN(count) || count <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid wallet count",
        variant: "destructive",
      })
      return
    }

    if (isNaN(total) || total <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid total amount",
        variant: "destructive",
      })
      return
    }

    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min > max) {
      toast({
        title: "Error",
        description: "Please enter valid min/max amounts (min must be less than max)",
        variant: "destructive",
      })
      return
    }

    if (min * count > total) {
      toast({
        title: "Error",
        description: "Total amount is too small for the minimum distribution",
        variant: "destructive",
      })
      return
    }

    // Generate random amounts within range
    const wallets: { address: string; amount: number }[] = []
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

      wallets.push({
        address: generateRandomAddress(),
        amount,
      })

      remaining -= amount
    }

    onGenerateWallets(wallets)

    toast({
      title: "Success",
      description: `Generated ${count} wallets with total amount ${total}`,
    })
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="walletCount">Number of Wallets</Label>
          <Input
            id="walletCount"
            type="number"
            placeholder="10"
            value={walletCount}
            onChange={(e) => setWalletCount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input
            id="totalAmount"
            type="number"
            step="0.000001"
            placeholder="100.00"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minAmount">Min per Wallet</Label>
          <Input
            id="minAmount"
            type="number"
            step="0.000001"
            placeholder="1.00"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxAmount">Max per Wallet</Label>
          <Input
            id="maxAmount"
            type="number"
            step="0.000001"
            placeholder="10.00"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seedPhrase">Seed Phrase (Optional)</Label>
        <div className="flex gap-2">
          <Textarea
            id="seedPhrase"
            placeholder="Enter seed phrase or generate one..."
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            className="font-mono text-sm resize-none"
            rows={3}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={generateSeedPhrase}
            className="shrink-0 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full crypto-gradient">
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Wallets
      </Button>
    </form>
  )
}
