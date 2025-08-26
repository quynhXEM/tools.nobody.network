"use client"

import type React from "react"

import { useState, useMemo } from "react"
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
import { formatNumber, getToolFee } from "@/libs/utils"
import { NotConnectLayout } from "@/views/NotConnectLayout"
import { DeployTokenEmail } from "@/libs/formemail"
import { CopyBtn } from "@/views/CopyButton"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"

export default function ChainBuilderTool() {
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <h2 className="text-white font-semibold">{t("token.configuration")}</h2>
                    </CardHeader>
                    <NotConnectLayout>
                        <CardContent className="space-y-6">
                            <form onSubmit={() => { }} className=" flex flex-1 flex-col gap-4">
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
                                    render={({ field }) => {
                                        // Format số với dấu phân cách
                                        const formatNumber = (value: string) => {
                                            if (!value) return '';
                                            // Loại bỏ tất cả ký tự không phải số
                                            const numericValue = value.replace(/[^0-9]/g, '');
                                            // Thêm dấu phân cách
                                            return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        };

                                        // Lấy giá trị số thuần (không có dấu phân cách)
                                        const getNumericValue = (value: string) => {
                                            return value.replace(/[^0-9]/g, '');
                                        };

                                        return (
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="totalSupply" className="text-sm text-white font-medium">{t("token.totalsupply")}</Label>
                                                <Input
                                                    disabled={loading}
                                                    id="totalSupply"
                                                    className="text-white"
                                                    type="text"
                                                    value={formatNumber(field.value || '')}
                                                    onChange={(e) => {
                                                        const numericValue = getNumericValue(e.target.value);
                                                        field.onChange(numericValue);
                                                    }}
                                                    placeholder={t("deploy_token.labels.total_supply_placeholder")}
                                                />
                                                {errors.totalSupply && <span className="text-red-500 text-xs">{errors.totalSupply.message as string}</span>}
                                            </div>
                                        );
                                    }}
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
                                                        <TooltipTrigger type="button" className="flex items-center">
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
                                                type="email"
                                                value={field.value?.toLowerCase() || ''}
                                                onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                                disabled={loading}
                                                placeholder={t("token.placeholder")}
                                                className="bg-slate-700 text-white border-slate-600"
                                                autoCapitalize="off"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                spellCheck="false"
                                            />
                                            {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                                            <p className="text-xs text-slate-400">{t("deploy_token.description_note")}</p>
                                        </div>
                                    )}
                                />

                                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-white">{t("deploy_token.deployment_fee")}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-white">{getToolFee(123999, chain, deploy_token_fee)} {chain_info[123999].symbol}</div>
                                            <div className="text-xs text-slate-400">{t("deploy_token.fee_required")}</div>
                                        </div>
                                    </div>
                                </div>

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
            </div>
        </div>
    )
}