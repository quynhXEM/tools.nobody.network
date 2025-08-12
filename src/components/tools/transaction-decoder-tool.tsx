"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, Copy, Trash2, FileText } from 'lucide-react'
import { useTranslations } from "next-intl"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import WalletConnect from "@/app/commons/WalletConnect"
import { useUserWallet } from "@/app/commons/UserWalletContext"

export function TransactionDecoderTool() {
  const { custom_fields: { usdt_payment_wallets } } = useAppMetadata()
  const [isDecoding, setIsDecoding] = useState(false)
  const [chainId, setChainId] = useState("97")
  const [decodeResult, setDecodeResult] = useState<any>(null)
  const { toast } = useToast()
  const { useTool } = useUserWallet()
  const t = useTranslations()

  const [formData, setFormData] = useState("")

  const handleDecode = async () => {
    setDecodeResult(null)
    if (!formData.trim()) {
      toast({
        title: t("transaction_decode.form.no_data_title"),
        description: t("transaction_decode.form.no_data_desc"),
        variant: "destructive",
      })
      return
    }

    setIsDecoding(true)

    const transaction = await useTool("1.01");
    if (!transaction) {
      setIsDecoding(false);
      return;
    };

    const data = await fetch("/api/transaction/decode", {
      method: "POST",
      body: JSON.stringify({
        txHash: formData,
        chainId: Number(chainId),
        rpcUrl: usdt_payment_wallets.find((item: any) => String(item.chain_id) === String(chainId))?.rpc_url
      }),
    }).then(data => data.json());
    if (data.ok) {
      setDecodeResult(data.result)
      setIsDecoding(false)
      toast({
        title: t("decoded.successful"),
        description: t("transaction_decode.toast.success_desc"),
      })
      return
    }
    setIsDecoding(false)
    toast({
      title: t("transaction_decode.toast.fail_title"),
      description: String(data.error ?? t("transaction_decode.toast.unknown_error")),
      variant: "destructive",
    })
  }

  const handleClear = () => {
    setFormData("")
    setDecodeResult(null)
  }

  const handleCopyJson = () => {
    if (decodeResult) {
      navigator.clipboard.writeText(JSON.stringify(decodeResult, null, 2))
      toast({
        title: t("transaction_decode.toast.copy_title"),
        description: t("transaction_decode.toast.copy_desc"),
      })
    }
  }

  const handleLoadExample = () => {
    setDecodeResult({
      "transactionType": "ERC-20 Transfer",
      "gasInfo": {
        "gasLimit": "69056",
        "maxFeePerGas": null,
        "maxPriorityFeePerGas": null,
        "gasPrice": "0.1 gwei",
        "baseFeePerGas": "0.0 gwei",
        "effectiveGasPrice": "0.1 gwei",
        "gasUsed": "29727",
        "feeWei": "2972700000000",
        "feeNative": "0.0000029727"
      },
      "decodedData": {
        "hash": "0xb22c57b812b79c811861b4a18fa58336c3edfe106fb845bd6bfe1bca200e74fa",
        "type": 0,
        "typeName": "legacy",
        "chainId": 56,
        "nonce": 9,
        "blockNumber": 57329484,
        "from": "0x270231Be28942FF0e7C49e6937d3e8568058F7F6",
        "to": "0x55d398326f99059fF775485246999027B3197955",
        "value": null,
        "data": "0xa9059cbb0000000000000000000000008894e0a0c962cb723c1976a4421c95949be2d4e3000000000000000000000000000000000000000000000226496c8db26e3c0000",
        "accessList": [],
        "authorizationList": null,
        "blobVersionedHashes": null,
        "maxFeePerBlobGas": null,
        "gasLimit": "69056",
        "gasPrice": "0.1 gwei",
        "maxFeePerGas": null,
        "maxPriorityFeePerGas": null,
        "serialized": null,
        "unsignedHash": null,
        "signature": {
          "r": "0xe9c7705c72793380c63d3aa185ad46c1b342a5dbe2ef0b143b4cd4215e84d322",
          "s": "0x42650bcaca18bfd70644b78a374d527b91b4102a194acd910c0b2d037aaaa157",
          "yParity": 0,
          "v": 27
        },
        "v": null,
        "r": null,
        "s": null,
        "kzg": null,
        "status": 1,
        "contractAddress": null,
        "decoded": {
          "methodName": "transfer",
          "methodId": "0xa9059cbb",
          "parameters": [
            {
              "name": "to",
              "type": "address",
              "value": "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3"
            },
            {
              "name": "amount",
              "type": "uint256",
              "value": "10151000000000000000000"
            }
          ]
        },
        "tokenInfo": {
          "address": "0x55d398326f99059fF775485246999027B3197955",
          "decimals": "18",
          "symbol": "USDT",
          "name": "Tether USD",
          "formattedAmount": "10151.0"
        }
      }
    })
  }

  return (
    <div>
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">{t("deploy_token.wallet_connection.title")}</h3>
            <p className="text-slate-400 text-sm">{t("deploy_token.wallet_connection.description")}</p>
          </div>
          <WalletConnect />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

        {/* Input Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("tx.config")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="chainId" className="text-sm text-white font-medium">{t("token.network")}</Label>
              <Select value={chainId} onValueChange={setChainId}>
                <SelectTrigger id="chainId" className="w-full text-white bg-gray-700">
                  <SelectValue placeholder={t("deploy_token.labels.select_chain")} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white">
                  {usdt_payment_wallets.map((opt: any) => (
                    <SelectItem key={opt.chain_id} value={String(opt.chain_id)}>{opt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hexData" className="text-slate-300">
                {t("hex.data")}
              </Label>
              <Textarea
                id="hexData"
                placeholder={t("hex.placeholder")}
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                className="bg-slate-700 border-slate-600 font-mono text-sm h-40"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDecode}
                disabled={isDecoding || !formData.trim()}
                className="flex-1 crypto-gradient"
              >
                {isDecoding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("decoding")}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    {t("decode.transaction")}
                  </>
                )}
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                className="bg-transparent text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("clear.data")}
              </Button>

            </div>
            <Button
              onClick={handleLoadExample}
              variant="outline"
              className="w-full text-gray-300 bg-slate-700/50 border-slate-600 hover:bg-slate-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t("load.example")}
            </Button>
            <div className="bg-slate-700/30 p-3 rounded-lg">
              <p className="text-xs text-slate-400">
                {t("transaction_decode.help.tip", { load_example: t("load.example") })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("decoded.results")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!decodeResult && !isDecoding && (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("transaction_decode.empty_state.message")}</p>
              </div>
            )}

            {isDecoding && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
                <p className="text-slate-300">{t("decoding")}</p>
              </div>
            )}

            {decodeResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{t("decoded.successful")}</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.transaction_type")}</Label>
                    <div className="text-lg font-semibold text-green-400">{decodeResult.transactionType}</div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.gas_information")}</Label>
                    <div className="space-y-1 text-sm text-slate-300">
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.gas_limit")}:</span><span>{decodeResult.gasInfo.gasLimit ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.gas_price")}:</span><span>{decodeResult.gasInfo.gasPrice ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.base_fee")}:</span><span>{decodeResult.gasInfo.baseFeePerGas ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.effective_gas_price")}:</span><span>{decodeResult.gasInfo.effectiveGasPrice ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.max_fee")}:</span><span>{decodeResult.gasInfo.maxFeePerGas ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.priority_fee")}:</span><span>{decodeResult.gasInfo.maxPriorityFeePerGas ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.gas_used")}:</span><span>{decodeResult.gasInfo.gasUsed ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.total_fee_wei")}:</span><span>{decodeResult.gasInfo.feeWei ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.total_fee_native")}:</span><span>{decodeResult.gasInfo.feeNative ?? "-"}</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.transaction_details")}</Label>
                    <div className="space-y-1 text-xs text-slate-300 font-mono break-all">
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.hash")}:</span><span>{decodeResult.decodedData.hash}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.type")}:</span><span>{decodeResult.decodedData.typeName} ({decodeResult.decodedData.type})</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.chain_id")}:</span><span>{decodeResult.decodedData.chainId}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.block")}:</span><span>{decodeResult.decodedData.blockNumber ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.from")}:</span><span>{decodeResult.decodedData.from}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.to")}:</span><span>{decodeResult.decodedData.to ?? "-"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.value")}:</span><span>{decodeResult.decodedData.value ?? "0"}</span></div>
                      <div className="flex justify-between"><span>{t("transaction_decode.fields.status")}:</span><span>{decodeResult.decodedData.status ?? "-"}</span></div>
                      {decodeResult.decodedData.contractAddress && (
                        <div className="flex justify-between"><span>{t("transaction_decode.fields.contract")}:</span><span>{decodeResult.decodedData.contractAddress}</span></div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-slate-400 text-sm">{t("decoded.json")}</Label>
                      <Button
                        onClick={handleCopyJson}
                        size="sm"
                        variant="outline"
                        className="bg-transparent text-xs text-white"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {t("copy.json")}
                      </Button>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-md max-h-96 overflow-y-auto">
                      <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono">
                        {JSON.stringify(decodeResult, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {decodeResult.decodedData.decoded && (
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.method_details")}</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">{t("transaction_decode.fields.method")}:</span>
                          <span className="text-green-400 font-mono">{decodeResult.decodedData.decoded.methodName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">{t("transaction_decode.fields.method_id")}:</span>
                          <span className="text-slate-200 font-mono">{decodeResult.decodedData.decoded.methodId}</span>
                        </div>
                        <div className="mt-3">
                          <span className="text-slate-300 text-sm">{t("transaction_decode.fields.parameters")}:</span>
                          <div className="mt-1 space-y-1">
                            {decodeResult.decodedData.decoded.parameters.map((param: any, index: number) => (
                              <div key={index} className="bg-slate-800 p-2 rounded text-xs">
                                <div className="text-slate-400">{param.name} ({param.type}):</div>
                                <div className="text-slate-200 font-mono break-all">{param.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {decodeResult.decodedData.tokenInfo && (
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.token_info")}</Label>
                      <div className="space-y-1 text-sm text-slate-300">
                        <div className="flex justify-between"><span>{t("transaction_decode.fields.token")}:</span><span className="font-mono">{decodeResult.decodedData.tokenInfo.address}</span></div>
                        <div className="flex justify-between"><span>{t("transaction_decode.fields.symbol")}:</span><span>{decodeResult.decodedData.tokenInfo.symbol ?? "-"}</span></div>
                        <div className="flex justify-between"><span>{t("transaction_decode.fields.name")}:</span><span>{decodeResult.decodedData.tokenInfo.name ?? "-"}</span></div>
                        <div className="flex justify-between"><span>{t("transaction_decode.fields.decimals")}:</span><span>{decodeResult.decodedData.tokenInfo.decimals ?? "-"}</span></div>
                        {decodeResult.decodedData.tokenInfo.formattedAmount && (
                          <div className="flex justify-between"><span>{t("transaction_decode.fields.amount")}:</span><span>{decodeResult.decodedData.tokenInfo.formattedAmount}</span></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
