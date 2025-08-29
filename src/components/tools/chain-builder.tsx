"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle, Info, AlertTriangle, TriangleAlert } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale, useTranslations } from "next-intl"
import { useUserWallet } from "@/app/commons/UserWalletContext"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useNotification } from "@/app/commons/NotificationContext"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"
import { Controller, useForm, useWatch } from "react-hook-form"
import { NotConnectLayout } from "@/views/NotConnectLayout"
import { ImageUpload } from "@/app/commons/ImageUpload"
import { getToolFee } from "@/libs/utils"
import { UploadImage } from "@/libs/upload"
import { ChainBuilderEmail } from "@/libs/formemail"
import WorldMap from "../commons/WorldMap"

export default function ChainBuilderTool() {
    const { isConnected } = useUserWallet()
    const t = useTranslations()
    const { notify } = useNotification()
    const [loading, setLoading] = useState<boolean>(false);
    const { sendTransaction, wallet, getChainInfo } = useUserWallet();
    const [vsLocation, setVSLocation] = useState<any>("");
    const { custom_fields: { chain_builder_fee, masterWallet }, chain, public_chain } = useAppMetadata();
    const locale = useLocale()

    const FormSchema = useMemo(() => z.object({
        chainName: z.string().min(1, t("chain_builder.validation.required_name")),
        chainId: z.string()
            .min(1, t("chain_builder.validation.required_chain_id"))
            .regex(/^\d+$/, t("chain_builder.validation.digits_only")),
        symbol: z.string()
            .min(1, t("chain_builder.validation.required_symbol"))
            .regex(/^[A-Z]+$/, t("chain_builder.validation.symbol_format")),
        explorerDomain: z.string().min(1, t("chain_builder.validation.required_explorer")),
        serverPosition: z.string(),
        email: z
            .string()
            .min(1, t("chain_builder.validation.required_email"))
            .email(t("chain_builder.validation.invalid_email")),
        chainPay: z.string(),
    }), [t])

    const checkChainId = (id: any) => {
        return public_chain?.[id] ?? false;
    }

    const { handleSubmit, control, formState: { errors }, setError, setValue, watch } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            chainName: "",
            chainPay: "123999",
            chainId: "",
            symbol: "",
            explorerDomain: "",
            email: "",
        }
    });

    const chainPay = watch("chainPay");

    const onSubmit = async (data: any) => {
        setLoading(true)

        const amount = getToolFee(chainPay, chain, chain_builder_fee)

        const sendtxn = await sendTransaction({
            amount: amount,
            to: masterWallet.address,
            type: "coin",
            chainId: Number(chainPay)
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

        const response = await fetch("/api/directus/request", {
            method: "POST",
            body: JSON.stringify({
                collection: "email_outbox",
                type: "createItem",
                items: {
                    status: "scheduled",
                    app_id: process.env.NEXT_PUBLIC_APP_ID,
                    to: process.env.NEXT_PUBLIC_EMAIL_SUPPOST,
                    subject: t("form_email.title.chain_builder", { name: data.chainName }),
                    body: ChainBuilderEmail({
                        data: {
                            ...data,
                            location: vsLocation,
                            wallet: wallet?.address,
                            amount: amount,
                            hash: `${getChainInfo(chainPay)?.chain_id.explorer_url}/tx/${sendtxn?.data}`
                        }
                    })
                }
            })
        }).then(data => data.json())
        if (response.ok) {
            notify({
                title: t("chain_builder.notify.success_title"),
                type: true,
                message: t("chain_builder.notify.deploy_success")
            })

        } else {
            notify({
                title: t("chain_builder.notify.failure_title"),
                type: false,
                message: t("chain_builder.notify.deploy_error_prefix") + (response?.result?.errors?.[0]?.message ?? "")
            })
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Input Form */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <h2 className="text-white font-semibold">{t("chain_builder.title")}</h2>
                    </CardHeader>
                    <NotConnectLayout>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="flex flex-1 flex-col gap-4">
                                        {/* Chain ID */}
                                        <Controller
                                            name="chainId"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="chainId" className="text-sm text-white font-medium">{t("chain_builder.labels.chain_id")}</Label>
                                                    <Input
                                                        disabled={loading}
                                                        id="chainId"
                                                        className="text-white bg-gray-700 border-gray-600"
                                                        type="text"
                                                        {...field}
                                                        placeholder="123999"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        onChange={(e) => {
                                                            if (checkChainId(e.target.value)) {
                                                                setError("chainId", {
                                                                    message: t("chain_builder.validation.invalid_chain_id")
                                                                })
                                                            }
                                                            const digitsOnly = e.target.value.replace(/\D/g, "");
                                                            field.onChange(digitsOnly);
                                                        }}
                                                    />
                                                    {errors.chainId && <span className="text-red-500 text-xs">{errors.chainId.message as string}</span>}
                                                </div>
                                            )}
                                        />
                                        {/* Chain Name */}
                                        <Controller
                                            name="chainName"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="chainName" className="text-sm text-white font-medium">{t("chain_builder.labels.chain_name")}</Label>
                                                    <Input
                                                        disabled={loading}
                                                        id="chainName"
                                                        className="text-white bg-gray-700 border-gray-600"
                                                        type="text"
                                                        {...field}
                                                        placeholder="Nobody Chain"
                                                    />
                                                    {errors.chainName && <span className="text-red-500 text-xs">{errors.chainName.message as string}</span>}
                                                </div>
                                            )}
                                        />
                                        {/* Symbol */}
                                        <Controller
                                            name="symbol"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="symbol" className="text-sm text-white font-medium">{t("chain_builder.labels.symbol")}</Label>
                                                    <Input
                                                        disabled={loading}
                                                        id="symbol"
                                                        className="text-white bg-gray-700 border-gray-600 uppercase"
                                                        type="text"
                                                        {...field}
                                                        placeholder="IDS"
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    />
                                                    {errors.symbol && <span className="text-red-500 text-xs">{errors.symbol.message as string}</span>}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col gap-4">
                                        {/* Explorer Domain */}
                                        <Controller
                                            name="explorerDomain"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="explorerDomain" className="text-sm text-white font-medium">{t("chain_builder.labels.explorer_domain")}</Label>
                                                    <Input
                                                        disabled={loading}
                                                        id="explorerDomain"
                                                        className="text-white bg-gray-700 border-gray-600"
                                                        type="text"
                                                        {...field}
                                                        placeholder="a-scan.nobody.network"
                                                    />
                                                    {errors.explorerDomain && <span className="text-red-500 text-xs">{errors.explorerDomain.message as string}</span>}
                                                </div>
                                            )}
                                        />
                                        {/* Email */}
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="email" className="text-sm text-white font-medium">{t("chain_builder.labels.email")}</Label>
                                                    <Input
                                                        disabled={loading}
                                                        id="email"
                                                        className="text-white bg-gray-700 border-gray-600"
                                                        type="email"
                                                        {...field}
                                                        placeholder="you@example.com"
                                                    />
                                                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="chainName" className="text-sm text-white font-medium">{t("chain_builder.serverlocation")}</Label>
                                    <p className="text-gray-400 text-xs">{t("chain_builder.serverlocation_description")}</p>
                                    <p className="text-gray-300 text-xs font-bold">{t("chain_builder.serverlocation_description_2")}</p>
                                </div>
                                <WorldMap setLocation={setVSLocation} />

                                <h2 className="text-white font-semibold mt-5">{t("chain_builder.deployment_fee")}</h2>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1">
                                        <Controller
                                            name="chainPay"
                                            control={control}
                                            rules={{ required: t("deploy_token.validation.required_chain") }}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1 w-full">
                                                    {/* <Label htmlFor="chainId" className="text-sm text-white font-medium">{t("token.network")}</Label> */}
                                                    <Select value={String(field.value)} onValueChange={field.onChange}>
                                                        <SelectTrigger disabled={loading} id="chainId" className="w-full text-white">
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
                                    </div>
                                    <div className="text-right flex-1">
                                        <div className="text-lg font-bold text-white">{getToolFee(chainPay, chain, chain_builder_fee)} {getChainInfo(chainPay)?.chain_id.symbol}</div>
                                        <div className="text-xs text-slate-400">{t("chain_builder.fee_required")}</div>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading || !isConnected || loading} className="w-full crypto-gradient">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t("token.deploying")}
                                        </>
                                    ) : (
                                        t("chain_builder.deploy")
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </NotConnectLayout>
                </Card>
            </div>
        </div>
    )
}