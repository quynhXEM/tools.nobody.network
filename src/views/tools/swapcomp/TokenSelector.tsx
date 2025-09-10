"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Description } from "@radix-ui/react-dialog"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"

interface Token {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
  extensions: {
    bridgeInfo: any
  }
}

interface TokenSelectorProps {
  selectedToken: Token | undefined
  onTokenSelect: (token: Token) => void
  tokens: Token[]
  className?: string
  chainId?: string
  differToken?: Token
}

export function TokenSelector({ selectedToken, onTokenSelect, tokens, className, chainId, differToken }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const { public_chain } = useAppMetadata()

  let dataTokens = tokens
  if (chainId) {
    dataTokens = tokens?.filter((token) => token.chainId.toString().includes(chainId))
  }
  if (differToken) {
    dataTokens = tokens?.filter((token) => token !== differToken)
  }
  const [search, setSearch] = useState("")
  const filteredTokens = dataTokens?.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token)
    setOpen(false)
    setSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-12 px-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-white",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            {/* <span className="text-lg">{selectedToken.logoURI}</span> */}
            <img src={selectedToken?.logoURI} alt={selectedToken?.symbol} className="w-4 h-4" />
            <span className="font-semibold">{selectedToken?.symbol}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
        <Description></Description>
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Popular Tokens */}
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {filteredTokens.map((token) => (
              <Button
                key={token.symbol + token.chainId + token.address}
                variant="ghost"
                onClick={() => handleTokenSelect(token)}
                className="w-full justify-between p-3 h-auto hover:bg-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  {/* <span className="text-xl">{token.logoURI}</span> */}
                  <img src={token?.logoURI} alt={token.symbol} className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-sm text-slate-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">
                    <img src={`https://icons.llamao.fi/icons/chains/rsz_${public_chain?.[token.chainId]?.icon}.jpg`} className="w-5 h-5 rounded-full"/></div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
