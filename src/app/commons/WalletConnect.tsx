"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTranslations } from "next-intl"
import { useUserWallet } from "./UserWalletContext"

export default function WalletConnect() {
  const { account, isConnected, wallet, connectWallet, disconnect } = useUserWallet()
  const t = useTranslations()
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)

  if (isConnected && account) {
    return (
      <>
        <div
          onClick={() => setShowDisconnectDialog(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/70 transition-colors"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-200 font-mono">{`${wallet?.address.slice(0, 6)}...${wallet?.address.slice(-4)}`}</span>
        </div>  

        <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
          <AlertDialogContent className="bg-slate-800 border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">{t("disconnect.wallet")}</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300">{t("disconnect.confirm")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  disconnect()
                  setShowDisconnectDialog(false)
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("disconnect.wallet")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <Button onClick={connectWallet} className="crypto-gradient">
      <Wallet className="w-4 h-4 mr-2" />
      {t("connect.wallet")}
    </Button>
  )
}
