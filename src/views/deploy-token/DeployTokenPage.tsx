"use client"
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, CirclePoundSterling, Zap } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z, } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
    name: z.string().min(1, { message: "Bắt buộc nhập tên token" }),
    symbol: z.string().min(1, { message: "Bắt buộc nhập ký hiệu" }),
    totalSupply: z.string().min(1, { message: "Bắt buộc nhập tổng cung" }),
    decimals: z.number().min(0, { message: "Tối thiểu 0" }).max(18, { message: "Tối đa 18" }),
    chainId: z.number().min(1, { message: "Bắt buộc chọn chain" }),
});

const CHAIN_OPTIONS = [
    { label: "Ethereum Mainnet", value: 1 },
    { label: "Binance Smart Chain", value: 56 },
    { label: "Polygon", value: 137 },
    { label: "Viplus Chain", value: 8678671 },
];

export default function DeployTokenPage() {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors }, } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            symbol: "",
            totalSupply: "",
        }
    });
    const onSubmit = (data: any) => {
        console.log(data);
    };
    return <div className="flex flex-col w-full max-w-2xl mx-auto p-4 gap-4">
        <div className="w-full flex items-center gap-1">
            <Button onClick={() => router.back()} variant={"ghost"} size={"icon"} className="cursor-pointer outline-none border-none">
                <ArrowLeft />
            </Button>
            <p className="text-md text-blue-800 font-semibold">Deploy Stable Token</p>
        </div>
        <div className="w-full bg-white rounded shadow p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Bắt buộc nhập tên token" }}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="name" className="font-medium">Tên Token</Label>
                            <Input id="name" type="text" {...field} placeholder="Wrapped Viplus Coin" />
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
                            <Label htmlFor="symbol" className="font-medium">Ký hiệu (Symbol)</Label>
                            <Input id="symbol" type="text" {...field} placeholder="WVPC" />
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
                            <Label htmlFor="totalSupply" className="font-medium">Tổng cung</Label>
                            <Input id="totalSupply" type="number" {...field} placeholder="200000000" />
                            {errors.totalSupply && <span className="text-red-500 text-xs">{errors.totalSupply.message as string}</span>}
                        </div>
                    )}
                />
                <Controller
                    name="decimals"
                    control={control}
                    rules={{ required: "Bắt buộc nhập số lẻ", min: { value: 0, message: "Tối thiểu 0" }, max: { value: 18, message: "Tối đa 18" } }}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="decimals" className="font-medium">Số lẻ thập phân (Decimals)</Label>
                            <Input id="decimals" type="number" {...field} placeholder="18" />
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
                            <Label htmlFor="chainId" className="font-medium">Chain</Label>
                            <Select value={String(field.value)} onValueChange={field.onChange}>
                                <SelectTrigger id="chainId">
                                    <SelectValue placeholder="Chọn chain" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CHAIN_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.chainId && <span className="text-red-500 text-xs">{errors.chainId.message as string}</span>}
                        </div>
                    )}
                />
                <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto">Triển khai</Button>
                </div>
            </form>
        </div>
    </div>;
}