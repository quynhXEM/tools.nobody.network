"use client"
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Coins, Copy, Eye, EyeOff, XCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z, } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppMetadata } from "@/app/commons/AppMetadataContext";
import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Separator } from "@/components/ui/separator";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyBtn } from "../CopyButton";
import { useNotification } from "@/app/commons/NotificationContext";
import { useUserWallet } from "@/app/commons/UserWalletContext";

const FormSchema = z.object({
    name: z.string().min(1, { message: "Bắt buộc nhập tên token" }),
    symbol: z
        .string()
        .min(1, { message: "Bắt buộc nhập ký hiệu" })
        .regex(/^[a-zA-Z0-9]+$/, { message: "Chỉ cho phép chữ cái và số, không ký tự đặc biệt" }),
    totalSupply: z.string().min(1, { message: "Bắt buộc nhập tổng cung" }),
    decimals: z
        .string()
        .refine(
            (val) => {
                const num = Number(val);
                return !isNaN(num) && num >= 1 && num <= 18 && Number.isInteger(num);
            },
            { message: "Số thập phân phải là số nguyên từ 1 đến 18" }
        ),
    chainId: z.string(),
});

export default function DeployTokenPage() {
    const router = useRouter();
    const { notify, register } = useNotification()
    const [loading, setLoading] = useState<boolean>(false);
    const { sendTransaction, account } = useUserWallet();
    const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
    const [data, setData] = useState<any>();
    const { custom_fields: { usdt_payment_wallets, ids_distribution_wallet } } = useAppMetadata()
    const { handleSubmit, control, formState: { errors }, } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            symbol: "",
            totalSupply: "",
            decimals: "",
            chainId: "97"
        }
    });

    const onSubmit = async (data: any) => {
        if (!account?.email) {
            register(account?.id || "");
            return;
        }

        setLoading(true)
        const sendtxn = await sendTransaction({
            amount: "1.23",
            to: ids_distribution_wallet.address,
            type: "coin",
            chainId: ids_distribution_wallet.chain_id
        })
            .then(data => ({ ok: true, data: data }))
            .catch(err => ({ ok: false, err: err }))
        console.log(sendtxn);

        if (!sendtxn.ok) {
            notify({
                title: "Thất bại",
                type: false,
                message: "Giao dịch không thành công"
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
        if (response.ok) {
            notify({
                title: "Thành công",
                type: true,
                message: "Token của bạn đã được tạo. Kiểm tra thông tin trên trang và email."
            })
            setData(response.result.data)
        } else {
            notify({
                title: "Thất bại",
                type: false,
                message: "Có lỗi xảy ra trong quá trình tạo token"
            })
        }
        setLoading(false)
    };


    const truncateAddress = (address: string, start = 6, end = 4) => {
        return `${address.slice(0, start)}...${address.slice(-end)}`
    }

    const maskSensitiveData = (data: string) => {
        return showSensitiveInfo ? data : "•".repeat(data.length)
    }

    if (!account) {
        return <div className="flex flex-1 w-full font-bold p-4 gap-4 justify-center items-center text-center">
            Kết nối ví để sử dụng
        </div>
    }
    return <div className="flex flex-col w-full p-4 gap-4">
        <div className="w-full flex items-center gap-1">
            <Button onClick={() => router.back()} variant={"ghost"} size={"icon"} className="cursor-pointer outline-none border-none">
                <ArrowLeft />
            </Button>
            <p className="text-md text-blue-800 font-semibold">Deploy Stable Token</p>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-1 bg-white rounded shadow p-4">
                <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-1 flex-col gap-4">
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Bắt buộc nhập tên token" }}
                        render={({ field }) => (
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="name" className="text-sm font-medium">Tên Token</Label>
                                <Input disabled={loading} id="name" className="text-sm" type="text" {...field} placeholder="Wrapped Viplus Coin" />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
                            </div>
                        )}
                    />
                    <Controller
                        name="symbol"
                        control={control}
                        rules={{ required: "Bắt buộc nhập ký hiệu" }}
                        render={({ field }) => (
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="symbol" className="text-sm font-medium">Ký hiệu (Symbol)</Label>
                                <Input disabled={loading} id="symbol" className="text-sm" type="text" {...field} placeholder="WVPC" />
                                {errors.symbol && <span className="text-red-500 text-xs">{errors.symbol.message as string}</span>}
                            </div>
                        )}
                    />
                    <Controller
                        name="totalSupply"
                        control={control}
                        rules={{ required: "Bắt buộc nhập tổng cung" }}
                        render={({ field }) => (
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="totalSupply" className="text-sm font-medium">Tổng cung</Label>
                                <Input disabled={loading} id="totalSupply" className="text-sm" type="number" {...field} placeholder="200000000" />
                                {errors.totalSupply && <span className="text-red-500 text-xs">{errors.totalSupply.message as string}</span>}
                            </div>
                        )}
                    />
                    <Controller
                        name="decimals"
                        control={control}
                        rules={{ required: "Bắt buộc nhập số lượng số thập phân" }}
                        render={({ field }) => (
                            <div className="flex flex-col gap-1 ">
                                <Label htmlFor="decimals" className="text-sm font-medium">Số lẻ thập phân (Decimals)</Label>
                                <Input disabled={loading} className="text-sm" id="decimals" type="text" {...field} placeholder="18" min={0} max={18} />
                                {errors.decimals && <span className="text-red-500 text-xs">{errors.decimals.message as string}</span>}
                            </div>
                        )}
                    />
                    <Controller
                        name="chainId"
                        control={control}
                        rules={{ required: "Bắt buộc chọn chain" }}
                        render={({ field }) => (
                            <div className="flex flex-col gap-1 w-full">
                                <Label htmlFor="chainId" className="text-sm font-medium">Chain</Label>
                                <Select value={String(field.value)} onValueChange={field.onChange}>
                                    <SelectTrigger disabled={loading} id="chainId" className="w-full">
                                        <SelectValue placeholder="Chọn chain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usdt_payment_wallets.map((opt: any) => (
                                            <SelectItem key={opt.chain_id} value={String(opt.chain_id)}>{opt.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.chainId && <span className="text-red-500 text-xs">{errors.chainId.message as string}</span>}
                            </div>
                        )}
                    />
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">{loading ? "Đang triển khai" : "Triển khai"}</Button>
                </form>
            </div>
            <div className="flex flex-2 flex-col bg-white rounded shadow p-4">
                {loading && <DotLottieReact
                    src="https://lottie.host/ac37542f-6ef3-436d-8792-1ef664b54fdb/Lxb6qvKTa8.lottie"
                    loop
                    autoplay
                />}
                {data && <>
                    <div>
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* <Wallet className="h-5 w-5" /> */}
                                    <CardTitle>Wallet Information</CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                                    className="flex items-center gap-2"
                                >
                                    {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    {showSensitiveInfo ? "Hide" : "Show"} Sensitive Data
                                </Button>
                            </div>
                            <CardDescription>Your wallet credentials and transaction information</CardDescription>
                        </div>
                        <div className="space-y-4">
                            {/* Wallet Address */}
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                                    <p className="font-mono text-sm">{truncateAddress(data.wallet.address)}</p>
                                </div>
                                <CopyBtn data={data.wallet.address} />
                            </div>

                            {/* Private Key */}
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Private Key</p>
                                    <p className="font-mono text-sm">
                                        {showSensitiveInfo
                                            ? truncateAddress(data.wallet.privateKey, 10, 6)
                                            : maskSensitiveData(data.wallet.privateKey)}
                                    </p>
                                </div>
                                <CopyBtn data={data.wallet.privateKey} />
                            </div>

                            {/* Mnemonic */}
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Mnemonic Phrase</p>
                                    <p className="font-mono text-sm">
                                        {showSensitiveInfo ? data.wallet.mnemonic : maskSensitiveData(data.wallet.mnemonic)}
                                    </p>
                                </div>
                                <CopyBtn data={data.wallet.mnemonic} />
                            </div>

                            {/* Public Key */}
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Public Key</p>
                                    <p className="font-mono text-sm">{truncateAddress(data.wallet.publicKey, 10, 6)}</p>
                                </div>
                                <CopyBtn data={data.wallet.publicKey} />
                            </div>

                            {/* Initial Transaction */}
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Initial Transaction</p>
                                    <p className="font-mono text-sm">{truncateAddress(data.initialTransaction, 10, 6)}</p>
                                </div>
                                <CopyBtn data={data.initialTransaction} />
                            </div>
                        </div>
                    </div>
                    <Separator className="my-3" />
                    {/* Token Information Card */}
                    <div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5" />
                                <CardTitle>Token Information</CardTitle>
                            </div>
                            <CardDescription>Details about your ANC token</CardDescription>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Token Name & Symbol */}
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Token</p>
                                    <p className="font-semibold">{data.token.name}</p>
                                </div>
                                {/* Symbol */}
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Decimals</p>
                                    <p className="font-semibold">{data.token.symbol}</p>
                                </div>

                                {/* Decimals */}
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Decimals</p>
                                    <p className="font-semibold">{data.token.decimals}</p>
                                </div>

                                {/* Total Supply */}
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Total Supply</p>
                                    <p className="font-semibold">{Number(data.token.totalSupply).toLocaleString()}</p>
                                </div>

                                {/* Token Address */}
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Contract Address</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-mono text-sm">{truncateAddress(data.token.address)}</p>
                                        <CopyBtn data={data.token.address} />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Verification Status */}
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                </div>
                                <Badge variant="destructive" className="mb-2">
                                    Failed
                                </Badge>
                                <p className="text-xs text-muted-foreground">{data.token.verificationStatus}</p>
                            </div>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    </div>;
}