"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, Copy, Trash2, FileText } from 'lucide-react'
import { useTranslations } from "next-intl"

export function TransactionDecoderTool() {
  const [isDecoding, setIsDecoding] = useState(false)
  const [decodeResult, setDecodeResult] = useState<any>(null)
  const { toast } = useToast()
  const t = useTranslations()

  const [formData, setFormData] = useState({
    hexData: "",
  })

  // Example transaction hex data
  const exampleHexData = "0x02f8b20182039485012a05f20085012a05f20082520894a0b86a33e6ba3e0f1a7b1a7b1a7b1a7b1a7b1a7b80b844a9059cbb000000000000000000000000742d35cc6634c0532925a3b8d4c9db96c4b4d8b10000000000000000000000000000000000000000000000000de0b6b3a7640000c080a0123456789abcdef123456789abcdef123456789abcdef123456789abcdef123456a0987654321fedcba987654321fedcba987654321fedcba987654321fedcba987654"

  const handleDecode = async () => {
    if (!formData.hexData.trim()) {
      toast({
        title: "Không có dữ liệu",
        description: "Vui lòng nhập hex data để decode",
        variant: "destructive",
      })
      return
    }

    setIsDecoding(true)

    // Simulate decoding process
    setTimeout(() => {
      // Mock decoded transaction data
      const mockDecodedData = {
        type: "0x2",
        chainId: "0x1",
        nonce: "0x39",
        maxPriorityFeePerGas: "0x12a05f200",
        maxFeePerGas: "0x12a05f200",
        gasLimit: "0x5208",
        to: "0xa0b86a33e6ba3e0f1a7b1a7b1a7b1a7b1a7b1a7b",
        value: "0x0",
        data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d4c9db96c4b4d8b10000000000000000000000000000000000000000000000000de0b6b3a7640000",
        accessList: [],
        v: "0x0",
        r: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef123456",
        s: "0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba987654",
        decoded: {
          methodName: "transfer",
          methodId: "0xa9059cbb",
          parameters: [
            {
              name: "to",
              type: "address",
              value: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1"
            },
            {
              name: "amount",
              type: "uint256", 
              value: "1000000000000000000"
            }
          ]
        }
      }

      setDecodeResult({
        originalHex: formData.hexData,
        decodedData: mockDecodedData,
        transactionType: "ERC-20 Transfer",
        gasInfo: {
          gasLimit: "21000",
          maxFeePerGas: "20 gwei",
          maxPriorityFeePerGas: "20 gwei"
        }
      })
      setIsDecoding(false)
      toast({
        title: t("decoded.successful"),
        description: "Transaction đã được decode thành công",
      })
    }, 2000)
  }

  const handleClear = () => {
    setFormData({ hexData: "" })
    setDecodeResult(null)
  }

  const handleLoadExample = () => {
    setFormData({ hexData: exampleHexData })
    // Auto decode the example
    setTimeout(() => {
      handleDecode()
    }, 100)
  }

  const handleCopyJson = () => {
    if (decodeResult) {
      navigator.clipboard.writeText(JSON.stringify(decodeResult.decodedData, null, 2))
      toast({
        title: "Đã copy!",
        description: "JSON data đã được copy vào clipboard",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">{t("tx.config")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hexData" className="text-slate-300">
              {t("hex.data")}
            </Label>
            <Textarea
              id="hexData"
              placeholder={t("hex.placeholder")}
              value={formData.hexData}
              onChange={(e) => setFormData({ ...formData, hexData: e.target.value })}
              className="bg-slate-700 border-slate-600 font-mono text-sm h-40"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleDecode} 
              disabled={isDecoding || !formData.hexData.trim()} 
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
              className="bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t("clear.data")}
            </Button>
          </div>

          <Button 
            onClick={handleLoadExample} 
            variant="outline" 
            className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            {t("load.example")}
          </Button>

          <div className="bg-slate-700/30 p-3 rounded-lg">
            <p className="text-xs text-slate-400">
              💡 Paste transaction hex data (bắt đầu với 0x) để decode thành JSON format dễ đọc. 
              Bấm "Load Example" để xem ví dụ.
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
              <p>Nhập hex data và bấm decode để xem kết quả</p>
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
                  <Label className="text-slate-400 text-sm mb-2 block">Transaction Type</Label>
                  <div className="text-lg font-semibold text-green-400">{decodeResult.transactionType}</div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <Label className="text-slate-400 text-sm mb-2 block">Gas Information</Label>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Gas Limit:</span>
                      <span>{decodeResult.gasInfo.gasLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Fee:</span>
                      <span>{decodeResult.gasInfo.maxFeePerGas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority Fee:</span>
                      <span>{decodeResult.gasInfo.maxPriorityFeePerGas}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-slate-400 text-sm">{t("decoded.json")}</Label>
                    <Button 
                      onClick={handleCopyJson}
                      size="sm" 
                      variant="outline" 
                      className="bg-transparent text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {t("copy.json")}
                    </Button>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-md max-h-96 overflow-y-auto">
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono">
                      {JSON.stringify(decodeResult.decodedData, null, 2)}
                    </pre>
                  </div>
                </div>

                {decodeResult.decodedData.decoded && (
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <Label className="text-slate-400 text-sm mb-2 block">Method Details</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Method:</span>
                        <span className="text-green-400 font-mono">{decodeResult.decodedData.decoded.methodName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Method ID:</span>
                        <span className="text-slate-200 font-mono">{decodeResult.decodedData.decoded.methodId}</span>
                      </div>
                      <div className="mt-3">
                        <span className="text-slate-300 text-sm">Parameters:</span>
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
