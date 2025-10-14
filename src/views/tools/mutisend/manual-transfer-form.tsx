"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ManualTransferFormProps {
  onAddWallet: (address: string, amount: number) => void
}

export function ManualTransferForm({ onAddWallet }: ManualTransferFormProps) {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      })
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
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
        <Label htmlFor="address">Wallet Address</Label>
        <Input
          id="address"
          placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.000001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={!address.trim() || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0} className="w-full crypto-gradient">
        <Plus className="mr-2 h-4 w-4" />
        Add Wallet
      </Button>
    </form>
  )
}
