"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Send, Copy, Check, Loader2, TriangleAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatNumber, getToolFee, roundToFirstSignificantDecimal } from "@/libs/utils"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"
import { ChainConfig } from "@/components/tools/multi-send-tool"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import { useNotification } from "@/app/commons/NotificationContext"
import { useLocale, useTranslations } from "next-intl"
import { SendEmail } from "@/libs/api"
import { MultiSendEmail } from "@/libs/formemail"

interface WalletEntry {
  id: string
  address: string
  amount: number
}

interface WalletListProps {
  wallets: WalletEntry[]
  onRemoveWallet: (id: string) => void
  onClearAll: () => void
  chainConfig: ChainConfig
}

export function WalletList({ wallets, onRemoveWallet, onClearAll, chainConfig }: WalletListProps) {
  const [email, setEmail] = useState("")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const t = useTranslations()
  const { custom_fields: { muti_send_fee, masterWallet }, chain } = useAppMetadata()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { getChainInfo, sendTransaction } = useUserWallet()
  const { toast } = useToast()
  const { notify } = useNotification()
  const totalAmount = wallets.reduce((sum, wallet) => sum + wallet.amount, 0);
  const totalFee = getToolFee(chainConfig.chainId, chain, muti_send_fee * wallets.length);
  const chain_info = getChainInfo(chainConfig.chainId)?.chain_id

  const transferToken = async () => {
    try {
      if (chainConfig.contractAddress) {
        const tx = await sendTransaction({
          to: masterWallet?.address,
          amount: totalAmount.toString(),
          type: "token",
          chainId: Number(chainConfig.chainId),
          tokenAddress: chainConfig.contractAddress
        })
        return tx;
      }
      return true;
    } catch (error) {
      notify({
        title: "Error",
        type: false,
        message: error?.toString()
      })
      setLoading(false)
      return false;
    }
  }

  const tranferFee = async () => {
    try {
      const amount = chainConfig.contractAddress ? totalFee : (totalAmount + totalFee)
      const tx = await sendTransaction({
        to: masterWallet?.address,
        amount: amount.toString(),
        type: "coin",
        chainId: Number(chainConfig.chainId)
      })
      return tx;
    } catch (error) {
      notify({
        title: "Error",
        type: false,
        message: error?.toString()
      })
      setLoading(false)
      return false
    }
  }

  const sendMuti = async () => {
    try {
      const result = await fetch("/api/transaction/sendmulti", {
        method: "POST",
        body: JSON.stringify({
          wallets,
          type: chainConfig.coinType,
          tokenAddress: chainConfig.contractAddress,
          chain_id: chainConfig.chainId,
          rpc: chain_info.rpc_url
        })
      }).then(data => data.json())
      return result
    } catch (error) {
      notify({
        title: "Error",
        type: false,
        message: error?.toString()
      })
      setLoading(false)
      return false
    }
  }

  const handleTransfer = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (wallets.length === 0) {
      toast({
        title: "Error",
        description: "No wallets to transfer",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    const txToken = await transferToken();
    if (!txToken) return;
    const fee = await tranferFee();
    if (!fee) return;
    const result = await sendMuti()
    console.log(result);
    
    await SendEmail({
      to: email,
      subject: "Transfer Confirmation",
      text: "Transfer Confirmation",
      html: MultiSendEmail({
        locale: locale,
        data: {
          token : {
            symbol: chainConfig.symbol || chain_info.symbol
          },
          transactions: result.transactionHashes,
          wallets: wallets,
          explorerUrl: chain_info.explorer_url
        }
      })
    })
    setIsDialogOpen(false)
    setEmail("")
    setLoading(false)
  }

  return (
    <Card className="p-6  bg-slate-800/50 border-slate-700 text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Transfer List</h2>
            <p className="text-sm text-muted-foreground">
              {wallets.length} {wallets.length === 1 ? "wallet" : "wallets"}
            </p>
          </div>
          {wallets.length > 0 && (
            <Button disabled={loading} variant="outline" size="sm" className="crypto-gradient" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Send className="h-6 w-6 text-green-300" />
            </div>
            <p className="text-sm font-medium mb-1">No wallets added yet</p>
            <p className="text-sm text-muted-foreground">Add wallets using the form to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4 ">
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-mono text-muted-foreground truncate font-bold">{wallet.address}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{formatNumber(wallet.amount)} {chainConfig.symbol || chain_info.symbol}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loading}
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => onRemoveWallet(wallet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Total Amount</span>
                <span className="text-lg font-bold text-white">{formatNumber(totalAmount)} {chainConfig.coinType == "coin" ? chain_info.symbol : chainConfig.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Fee</span>
                <span className="text-lg font-bold text-white">{totalFee} {chain_info.symbol}</span>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={loading} className="w-full crypto-gradient" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Execute Transfer
                  </Button>
                </DialogTrigger>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
                    <p className="text-slate-300">{t("token.deploying")}</p>
                    <div className="text-yellow-500 font-bold flex flex-col gap-1 items-center justify-center mt-3">
                      <TriangleAlert className="w-6" />
                      {t("deploy_token.notify.warning_progress_desc")}
                    </div>
                  </div>
                ) : <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Confirm Transfer</DialogTitle>
                    <DialogDescription>
                      Enter your email to receive transfer confirmation and proceed with the transaction.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-gray-400 text-sm">Thông tin các ví nhận coin/token sẽ được gửi đến địa chỉ email này.</p>
                    </div>
                    <div className="rounded-lg p-4 space-y-2 border-1 border-gray-500 rounded-lg">
                      <div className=" text-sm">
                        {!chainConfig.contractAddress ? <span className="text-white">Bạn sẽ nhận được yêu cầu giao dịch {totalAmount + totalFee} {chain_info.symbol}</span>
                          : <span className="text-white">Bạn sẽ nhận được yêu cầu giao dịch {totalAmount} {chainConfig.symbol} và {totalFee} {chain_info.symbol}</span>}{". "}
                        <span className="text-white">Chấp nhận yêu cầu giao dịch để trả phí và chờ để các giao dịch hoàn tất.</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button disabled={loading} variant="outline" className="text-black" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button disabled={!email.trim() || !email.includes("@")} className="crypto-gradient" onClick={handleTransfer}>Confirm Transfer</Button>
                  </DialogFooter>
                </DialogContent>}
              </Dialog>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
