"use client"
import { useEffect, useState } from "react"
import { ArrowLeftRight, ArrowUpDown, Loader2, Settings, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenSelector } from "@/views/tools/swapcomp/TokenSelector"
import { NotConnectLayout } from "@/views/NotConnectLayout"
import { useTranslations } from "next-intl"
import { fetchTokenList, formatNumber } from "@/libs/utils"
import { ethers, formatUnits } from "ethers"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import { useNotification } from "@/app/commons/NotificationContext"
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


export const SwapToolsPage = () => {
    const [fromToken, setFromToken] = useState<Token>()
    const [toToken, setToToken] = useState<Token>()
    const [fromAmount, setFromAmount] = useState("")
    const [debouncedFromAmount, setDebouncedFromAmount] = useState("")
    const [toAmount, setToAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [tokenList, setTokenList] = useState<any[]>([])
    const [checkPool, setCheckPool] = useState<any>(null)
    const t = useTranslations("swap")
    const { swapToken, wallet } = useUserWallet();
    const { notify } = useNotification()
    const { custom_fields : { masterWallet, swap_fee_Bps }, } = useAppMetadata()

    const handleSwap = async () => {
        if(!wallet) return;
        if (!fromToken || !toToken || !debouncedFromAmount) return;
        setIsLoading(true)
        const swapData = {
            chainId: String(fromToken.chainId),
            sellToken: fromToken.address,
            buyToken: toToken.address,
            sellAmount: BigInt(Number(debouncedFromAmount) * 10 ** Number(fromToken.decimals)).toString(),
            taker: wallet.address
        }
        await swapToken({
            swapData: swapData,
            permitData: checkPool?.permit2?.eip712,
            tx: checkPool?.transaction
        })

        setIsLoading(false)
    }

    const hanldeCheckPool = async () => {
        const respone = await fetch(`/api/swap/check-pool`, {
            method: "POST",
            body: JSON.stringify({
                chainId: fromToken?.chainId,
                sellToken: fromToken?.address,
                buyToken: toToken?.address,
                sellAmount: BigInt(Number(debouncedFromAmount) * 10 ** Number(fromToken?.decimals)).toString(),
                taker: wallet?.address,
                swapFeeRecipient: masterWallet?.address,
                swapFeeBps: swap_fee_Bps,
            })
        }).then(data => data.json())
        if (respone.ok && respone?.result?.allowanceTarget) {
            setCheckPool(respone?.result)
            setToAmount(formatNumber(formatUnits(respone?.result?.minBuyAmount, toToken?.decimals)))
            console.log(respone.result);
        } else {
            notify({
                title: t("noti.error"),
                type: false,
                message: t("noti.pool_not_found")
            })
            setCheckPool(null)
        }
    }

    // Debounce fromAmount - chỉ gọi API sau khi người dùng ngừng nhập 500ms
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedFromAmount(fromAmount)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [fromAmount])

    useEffect(() => {
        const loadTokenList = async () => {
            const data = await fetchTokenList()
            setTokenList(data)
        }
        loadTokenList()
    }, [])

    useEffect(() => {
        setToAmount("")
        setCheckPool(null)
        if (!fromToken || !toToken || !fromAmount) return;
        hanldeCheckPool()
    }, [fromToken, toToken])

    useEffect(() => {
        setCheckPool(null)
        if (!debouncedFromAmount || !fromToken || !toToken || !fromAmount) return;
        hanldeCheckPool()
    }, [debouncedFromAmount])



    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                            <ArrowLeftRight className="h-5 w-5 text-cyan-400" />
                            Swap Tokens
                        </CardTitle>

                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <NotConnectLayout>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{t("labels.from")}</span>
                                <span className="text-slate-400">
                                    {t("labels.balance")}
                                </span>
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="0.0"
                                    value={fromAmount}
                                    onChange={(e) => setFromAmount(e.target.value)} //only number
                                    className="text-2xl font-mono bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 pr-32 h-16"
                                />
                                <TokenSelector
                                    selectedToken={fromToken}
                                    onTokenSelect={setFromToken}
                                    tokens={tokenList}
                                    className="absolute right-2 top-2"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{t("labels.to")}</span>
                                <span className="text-slate-400">
                                    {t("labels.balance")}
                                </span>
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="0.0"
                                    value={toAmount}
                                    readOnly
                                    className="text-2xl font-mono bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 pr-32 h-16"
                                />
                                <TokenSelector
                                    selectedToken={toToken}
                                    onTokenSelect={setToToken}
                                    tokens={tokenList}
                                    className="absolute right-2 top-2"
                                    chainId={fromToken?.chainId?.toString()}
                                    differToken={fromToken}
                                />
                            </div>
                        </div>

                        {fromAmount && toAmount && (
                            <div className="bg-slate-900/30 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">{t("labels.exchange_rate")}</span>
                                    <span className="text-white font-mono">
                                        {formatNumber(Number(formatUnits(checkPool?.minBuyAmount, toToken?.decimals)) / Number(formatUnits(checkPool.sellAmount, fromToken?.decimals)))}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleSwap}
                            disabled={isLoading || !checkPool}
                            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t("actions.swapping")}
                                </div>
                            ) : (
                                t("actions.swap")
                            )}
                        </Button>

                    </NotConnectLayout>
                </CardContent>
            </Card>
        </div>
    )
}