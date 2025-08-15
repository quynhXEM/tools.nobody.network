"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, Copy, Trash2, FileText } from 'lucide-react'
import { useTranslations } from "next-intl"
import { CopyBtn } from "@/views/CopyButton"

export function TransactionDecoderTool() {
  const [isDecoding, setIsDecoding] = useState(false)
  const [decodeResult, setDecodeResult] = useState<any>(null)
  const { toast } = useToast()
  const t = useTranslations()

  const [formData, setFormData] = useState("")

  const shorten = (val?: string | null) => {
    if (!val) return "-"
    const s = String(val)
    if (s.length <= 14) return s
    return `${s.slice(0, 8)}.....${s.slice(-4)}`
  }

  const handleDecode = async (hash?: any) => {
    setDecodeResult(null)
    if (!formData.trim() && !hash) {
      toast({
        title: t("transaction_decode.form.no_data_title"),
        description: t("transaction_decode.form.no_data_desc"),
        variant: "destructive",
      })
      return
    }

    setIsDecoding(true)

    const data = await fetch("/api/transaction/decode", {
      method: "POST",
      body: JSON.stringify({
        txHex: hash ?? formData,
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

  const handleClear = async () => {
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

  const handleLoadExample = async () => {
    setFormData("0xf86c1984b2d05e0082520894e0c7897d48847b6916094bf5cd8216449ea8fb86880856b0416a89e821808193a03f210e18806071ba1d6d0194e996c151edebd47d2cdd123d7b0e90aedbbb4692a010918ccc67bf1883c72d165f00344035d442897b4a30fe468c85d10f7ab60a3c")
    handleDecode("0xf86c1984b2d05e0082520894e0c7897d48847b6916094bf5cd8216449ea8fb86880856b0416a89e821808193a03f210e18806071ba1d6d0194e996c151edebd47d2cdd123d7b0e90aedbbb4692a010918ccc67bf1883c72d165f00344035d442897b4a30fe468c85d10f7ab60a3c")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

      {/* Input Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <h2 className="text-white font-semibold">{t("tx.config")}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
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
              onClick={() => {
                handleDecode(formData)
              }}
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
              className="bg-transparent text-white"
            >
              <Trash2 className="w-4 h-4" />
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
          <h2 className="text-white font-semibold">{t("decoded.results")}</h2>
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
                {/* Transaction Details (from hex) */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.transaction_details")}</Label>
                  <div className="space-y-1 text-xs text-slate-300 font-mono break-all">
                    {decodeResult.type !== undefined && (
                      <div className="flex justify-between"><span>Type:</span><span>{String(decodeResult.type)}</span></div>
                    )}
                    {decodeResult.chainId !== undefined && (
                      <div className="flex justify-between"><span>ChainId:</span><span>{String(decodeResult.chainId)}</span></div>
                    )}
                    {decodeResult.nonce !== undefined && (
                      <div className="flex justify-between"><span>Nonce:</span><span>{String(decodeResult.nonce)}</span></div>
                    )}
                    {decodeResult.value !== undefined && (
                      <div className="flex justify-between"><span>Value:</span><span>{String(decodeResult.value)}</span></div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>To:</span>
                      <div className="flex items-center gap-1">
                        <span>{shorten(decodeResult.to ? String(decodeResult.to) : "-")}</span>
                        {decodeResult.to && <CopyBtn data={String(decodeResult.to)} />}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data:</span>
                      <div className="flex items-center gap-1">
                        <span>{shorten(decodeResult.data ? String(decodeResult.data) : "-")}</span>
                        {decodeResult.data && <CopyBtn data={String(decodeResult.data)} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gas Information */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <Label className="text-slate-400 text-sm mb-2 block">{t("transaction_decode.section.gas_information")}</Label>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div className="flex justify-between"><span>Gas Limit:</span><span>{decodeResult.gasLimit ?? "-"}</span></div>
                    <div className="flex justify-between"><span>Gas Price:</span><span>{decodeResult.gasPrice ?? "-"}</span></div>
                    <div className="flex justify-between"><span>Max Priority Fee:</span><span>{decodeResult.maxPriorityFeePerGas ?? "-"}</span></div>
                    <div className="flex justify-between"><span>Max Fee:</span><span>{decodeResult.maxFeePerGas ?? "-"}</span></div>
                  </div>
                </div>

                {/* Signature */}
                {((decodeResult as any).sig || (decodeResult as any).signature) && (
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <Label className="text-slate-400 text-sm mb-2 block">Signature</Label>
                    <div className="space-y-1 text-xs text-slate-300 font-mono break-all">
                      {(() => {
                        const sig = (decodeResult as any).sig || (decodeResult as any).signature;
                        return (
                          <>
                            {sig.networkV !== undefined && (
                              <div className="flex justify-between"><span>networkV:</span><span>{String(sig.networkV)}</span></div>
                            )}
                            {sig.v !== undefined && (
                              <div className="flex justify-between"><span>v:</span><span>{String(sig.v)}</span></div>
                            )}
                            {sig.r && (
                              <div className="flex justify-between items-center">
                                <span>r:</span>
                                <div className="flex items-center gap-1">
                                  <span>{shorten(String(sig.r))}</span>
                                  <CopyBtn data={String(sig.r)} />
                                </div>
                              </div>
                            )}
                            {sig.s && (
                              <div className="flex justify-between items-center">
                                <span>s:</span>
                                <div className="flex items-center gap-1">
                                  <span>{shorten(String(sig.s))}</span>
                                  <CopyBtn data={String(sig.s)} />
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Access List */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <Label className="text-slate-400 text-sm mb-2 block">Access List</Label>
                  <div className="bg-slate-800 p-3 rounded-md max-h-60 overflow-y-auto">
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono">
                      {decodeResult.accessList ? JSON.stringify(decodeResult.accessList, null, 2) : "-"}
                    </pre>
                  </div>
                </div>

                {/* Raw JSON */}
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
