"use client"

import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Token {
  symbol: string
  name: string
  logo: string
  balance: string
  price: number
}

interface TransactionSummaryProps {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  exchangeRate: string
  priceImpact: string
  slippage: string
}

export function TransactionSummary({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  exchangeRate,
  priceImpact,
  slippage,
}: TransactionSummaryProps) {
  const networkFee = "0.0023"
  const minimumReceived = (Number(toAmount) * (1 - Number(slippage) / 100)).toFixed(6)

  return (
    <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Transaction Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">You pay</span>
          <span className="text-white font-mono">
            {fromAmount} {fromToken.symbol}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">You receive</span>
          <span className="text-white font-mono">
            {toAmount} {toToken.symbol}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Exchange rate</span>
          <span className="text-white font-mono">
            1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Price impact</span>
          <Badge
            variant="outline"
            className={`font-mono ${
              Number(priceImpact) > 1 ? "border-amber-500/50 text-amber-400" : "border-emerald-500/50 text-emerald-400"
            }`}
          >
            {priceImpact}%
          </Badge>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Network fee</span>
          <span className="text-white font-mono">{networkFee} ETH</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Minimum received</span>
          <span className="text-white font-mono">
            {minimumReceived} {toToken.symbol}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
