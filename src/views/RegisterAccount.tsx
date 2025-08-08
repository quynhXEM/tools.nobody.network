"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { useMemo, useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface NotificationModalProps {
    t: (key: string) => string;
    id: string;
    isOpen: boolean;
    onClose: () => void;
}
// Schema sẽ được tạo trong component để có thể dùng i18n

export function RegisterAccount({
    t,
    id,
    isOpen,
    onClose,
}: NotificationModalProps) {
    const iconColor = "text-emerald-500"
    const titleColor = "text-emerald-300"
    const borderColor = "border-emerald-500/50"
    const bgGradient = "bg-gradient-to-r from-emerald-900/20 to-green-900/20"
    const buttonColor = "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
    const [loading, setLoading] = useState<boolean>(false)

    const registerSchema = useMemo(() => z.object({
        email: z
            .string()
            .min(1, { message: t("register_modal.validation.required_email") })
            .email({ message: t("register_modal.validation.invalid_email") }),
        username: z
            .string()
            .min(1, { message: t("register_modal.validation.required_username") })
            .regex(/^[a-zA-Z0-9]+$/, { message: t("register_modal.validation.username_alnum") }),
    }), [t])

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            username: ""
        }
    });
    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        setLoading(true);
        const update_info = await fetch("/api/directus/request", {
            method: "POST",
            body: JSON.stringify({
                type: "updateItem",
                collection: "member",
                id: id,
                items: {
                    email: data.email,
                    username: data.username,
                },
            }),
        }).then((data) => data.json());
        if (update_info.ok) {
            
        } else {
           
        }
        setLoading(false);
    }
    if (!isOpen) return null;
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md mx-4 bg-gray-900 border-gray-800 ${borderColor} shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300`}
            >
                <CardHeader className="pb-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${bgGradient}`}
                            >
                                <Info className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <div>
                                <CardTitle className={`text-lg ${titleColor}`}>
                                    {t("register_modal.title")}
                                </CardTitle>
                                <p className="text-white">{t("register_modal.description")}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Message Content */}
                    <div className={`p-4 rounded-lg overflow-hidden border ${borderColor} ${bgGradient}`}>
                        <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-1 flex-col gap-4">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="email" className="text-sm text-white font-medium">{t("register_modal.labels.email")}</Label>
                                        <Input disabled={loading} id="email" className="text-sm text-white" type="text" {...field} placeholder={t("register_modal.placeholders.email")} />
                                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                                    </div>
                                )}
                            />
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="username" className="text-sm text-white font-medium">{t("register_modal.labels.username")}</Label>
                                        <Input disabled={loading} id="username" className="text-sm text-white" type="text" {...field} placeholder={t("register_modal.placeholders.username")} />
                                        {errors.username && <span className="text-red-500 text-xs">{errors.username.message as string}</span>}
                                    </div>
                                )}
                            />
                            <Button type="submit" disabled={loading} className={`w-full md:w-auto ${buttonColor}`}>{loading ? t("register_modal.buttons.registering") : t("register_modal.buttons.register")}</Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
