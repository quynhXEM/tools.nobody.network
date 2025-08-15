"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale, useTranslations } from "next-intl"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useNotification } from "@/app/commons/NotificationContext"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"
import { Controller, useForm } from "react-hook-form"
import { formatNumber } from "@/libs/utils"
import Link from "next/link"
import { NotConnectLayout } from "@/views/NotConnectLayout"
import { SendEmail } from "@/libs/api"
import { DeployTokenEmail } from "@/libs/formemail"

// Schema sẽ được tạo trong component để dùng i18n

export function ImprovedTokenDeployTool() {
  const [deployResult, setDeployResult] = useState<any>(null)
  const { isConnected } = useUserWallet()
  const t = useTranslations()
  const { notify } = useNotification()
  const [loading, setLoading] = useState<boolean>(false);
  const { sendTransaction } = useUserWallet();
  const { custom_fields: { deploy_token_fee, chain_info }, chain } = useAppMetadata()
  const locale = useLocale();
  
  
  const FormSchema = useMemo(() => z.object({
    chainId: z.string(),
    name: z.string().min(1, { message: t("deploy_token.validation.required_name") }),
    symbol: z
      .string()
      .min(1, { message: t("deploy_token.validation.required_symbol") })
      .regex(/^[a-zA-Z0-9]+$/, { message: t("deploy_token.validation.symbol_alnum") }),
    totalSupply: z
      .string()
      .min(1, { message: t("deploy_token.validation.required_total_supply") })
      .refine((val) => {
        const num = Number(val)
        return Number.isInteger(num) && num > 0
      }, { message: t("deploy_token.validation.total_supply_integer_positive") }),
    decimals: z
      .string()
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num >= 1 && num <= 18 && Number.isInteger(num);
        },
        { message: t("deploy_token.validation.decimals_integer_range") }
      ),
    email: z.string().optional(),
  }), [t])
  const { handleSubmit, control, formState: { errors }, } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      totalSupply: "",
      decimals: "18",
      chainId: chain?.[0]?.chain_id?.id,
      email: ""
    }
  });

  const onSubmit = async (data: any) => {
    setDeployResult(null);
    setLoading(true)
    const sendtxn = await sendTransaction({
      amount: deploy_token_fee,
      to: chain_info[data.chainId].address,
      type: "coin",
      chainId: data.chainId
    })
      .then(data => ({ ok: true, data: data }))
      .catch(err => {
        return { ok: false, err: err }
      })

    if (!sendtxn.ok) {
      notify({
        title: t("deploy_token.notify.failure_title"),
        type: false,
        message: t("deploy_token.notify.tx_failed")
      })
      setLoading(false);
      return;
    }
    const response = await fetch(`/api/token/deploy`, {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        symbol: data.symbol,
        totalSupply: data.totalSupply,
        decimals: data.decimals,
        chainId: data.chainId,
      })
    }).then(data => data.json())
    if (response.ok && response.result.data) {
      if (data.email) {
        await SendEmail({
          to: data.email,
          subject: t("form_email.title.deploy_token"),
          text: "",
          html: DeployTokenEmail({locale: locale, data: {
            ...response.result.data,
            chain: chain.find((opt: any) => opt.chain_id.id == Number(data.chainId))
          }})
        })
      }
      notify({
        title: t("deploy_token.notify.success_title"),
        type: true,
        message: t("deploy_token.notify.deploy_success")
      })
      setDeployResult({
        ...response.result.data,
        chain: chain.find((opt: any) => opt.chain_id.id == Number(data.chainId))
      })
      
    } else {
      notify({
        title: t("deploy_token.notify.failure_title"),
        type: false,
        message: t("deploy_token.notify.deploy_error_prefix") + (response?.result?.errors[0]?.message ?? "")
      })
    }
    setLoading(false)
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <h2 className="text-white font-semibold">{t("token.configuration")}</h2>
          </CardHeader>
          <NotConnectLayout>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-1 flex-col gap-4">
                <Controller
                  name="chainId"
                  control={control}
                  rules={{ required: t("deploy_token.validation.required_chain") }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <Label htmlFor="chainId" className="text-sm text-white font-medium">{t("token.network")}</Label>
                      <Select value={String(field.value)} onValueChange={field.onChange}>
                        <SelectTrigger disabled={loading} id="chainId" className="w-full text-white bg-gray-700">
                          <SelectValue placeholder={t("deploy_token.labels.select_chain")} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white">
                          {chain.map((opt: any) => (
                            <SelectItem key={opt.chain_id.id} value={String(opt.chain_id.id)}>
                              <img src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${opt.chain_id.icon}/ids-coin.svg`} alt={opt.chain_id.name} className="w-4 h-4 mr-2" />
                              {opt.chain_id.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.chainId && <span className="text-red-500 text-xs">{errors.chainId.message as string}</span>}
                    </div>
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: t("deploy_token.validation.required_name") }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="name" className="text-sm text-white font-medium">{t("token.name")}</Label>
                      <Input disabled={loading} id="name" className="text-white" type="text" {...field} placeholder={t("deploy_token.labels.name_placeholder")} />
                      {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
                    </div>
                  )}
                />
                <Controller
                  name="symbol"
                  control={control}
                  rules={{ required: t("deploy_token.validation.required_symbol") }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="symbol" className="text-sm text-white font-medium">{t("token.symbol")}</Label>
                      <Input disabled={loading} id="symbol" className="text-white" type="text" {...field} placeholder={t("deploy_token.labels.symbol_placeholder")} />
                      {errors.symbol && <span className="text-red-500 text-xs">{errors.symbol.message as string}</span>}
                    </div>
                  )}
                />
                <Controller
                  name="totalSupply"
                  control={control}
                  rules={{ required: t("deploy_token.validation.required_total_supply") }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="totalSupply" className="text-sm text-white font-medium">{t("token.totalsupply")}</Label>
                      <Input disabled={loading} id="totalSupply" className="text-white" type="number" {...field} placeholder={t("deploy_token.labels.total_supply_placeholder")} />
                      {errors.totalSupply && <span className="text-red-500 text-xs">{errors.totalSupply.message as string}</span>}
                    </div>
                  )}
                />
                <Controller
                  name="decimals"
                  control={control}
                  rules={{ required: t("deploy_token.validation.required_decimals") }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <Label htmlFor="decimalsNum" className="text-sm text-white font-medium">{t("token.decimals")}</Label>
                      <Select value={String(field.value)} onValueChange={field.onChange}>
                        <SelectTrigger disabled={loading} id="decimalsNum" className="w-full text-white bg-gray-700">
                          <SelectValue placeholder={t("deploy_token.labels.select_decimals")} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white">
                          <SelectItem value="18">{t("deploy_token.labels.decimals_option_standard")}</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.chainId && <span className="text-red-500 text-xs">{errors.chainId.message as string}</span>}
                    </div>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Label htmlFor="name" className="text-sm text-white font-medium"> {t("token.email")} ({t("token.optional")})</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-white">{t("deploy_token.description_tooltip")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="email"
                        {...field}
                        disabled={loading}
                        placeholder={t("token.placeholder")}
                        className="bg-slate-700 text-white border-slate-600"
                      />
                      {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                      <p className="text-xs text-slate-400">{t("deploy_token.description_note")}</p>
                    </div>
                  )}
                />

                <Button type="submit" disabled={loading || !isConnected || loading} className="w-full crypto-gradient">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("token.deploying")}
                    </>
                  ) : (
                    t("token.deploy")
                  )}
                </Button>
              </form>
            </CardContent>
          </NotConnectLayout>
        </Card>

        {/* Results */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("deployment.results")}</CardTitle>
          </CardHeader>
          <NotConnectLayout>
            <CardContent>
              {!deployResult && !loading && (
                <div className="text-center py-12 text-slate-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t("token.configuration")}</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
                  <p className="text-slate-300">{t("token.deploying")}</p>
                  <p className="text-sm text-slate-400 mt-2">{t("deployment.may.take.minutes")}</p>
                </div>
              )}

              {deployResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">{t("deployment.successful")}</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-400 text-sm">{t("token.wallet")}</Label>
                      <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-200 capitalize">
                        {deployResult.wallet.address}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-400 text-sm">{t("contract.address")}</Label>
                      <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                        {deployResult.token.address}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-400 text-sm">{t("transaction.hash")}</Label>
                      <div className="bg-slate-700 p-3 rounded-md font-mono text-sm text-slate-200 break-all">
                        {deployResult.initialTransaction}
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h4 className="text-sm text-white font-medium text-slate-300 mb-2">{t("token.info")}</h4>
                      <div className="space-y-1 text-sm text-slate-400">
                        <div className="flex justify-between">
                          <span>{t("name")}:</span>
                          <span className="text-slate-200">{deployResult.token.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("symbol")}:</span>
                          <span className="text-slate-200">{deployResult.token.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("token.totalsupply")}:</span>
                          <span className="text-slate-200">{formatNumber(deployResult.token.totalSupply)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4 bg-transparent text-white">
                    <Link href={`${deployResult.token.chainId?.explorer_url}/token/${deployResult.token.address}`} target="_blank">{t("view.explorer")}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </NotConnectLayout>
        </Card>
      </div>
    </div>
  )
}
