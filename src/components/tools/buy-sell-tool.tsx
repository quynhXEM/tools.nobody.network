"use client"
import { TransakConfig, Transak } from '@transak/transak-sdk';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useEffect, useRef, useState } from 'react';
import { useUserWallet } from '@/app/commons/UserWalletContext';
import { useTranslations } from 'next-intl';

const MoonPayProvider = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayProvider),
    { ssr: false },
);

const MoonPayBuyWidget = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayBuyWidget),
    { ssr: false },
);

export const BuySellCryptoTool = () => {
    const [tab, setTab] = useState("1")
    const transakRef = useRef<Transak | null>(null)
    const transakContainerId = 'transak-widget'
    const { wallet } = useUserWallet()
    const t = useTranslations("buysell")
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (tab !== "2") {
            if (transakRef.current) {
                try { transakRef.current.close(); } catch { }
                transakRef.current = null;
            }
            return;
        }

        const tryInit = () => {
            const container = document.getElementById(transakContainerId);
            if (!container) {
                requestAnimationFrame(tryInit);
                return;
            }
            if (transakRef.current) return;

            const transakConfig: TransakConfig = {
                containerId: transakContainerId,
                apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || "",
                defaultFiatCurrency: "USD",
                defaultCryptoCurrency: "ETH",
                defaultCryptoAmount: 200,
                walletAddress: wallet?.address,
                environment: Transak.ENVIRONMENTS.STAGING
            };

            const instance = new Transak(transakConfig);    
            transakRef.current = instance;
            instance.init();
        };

        requestAnimationFrame(tryInit);
    }, [tab])

    return <MoonPayProvider apiKey={process.env.NEXT_PUBLIC_MOONPAY_API_KEY || ""} debug>
        <Tabs value={tab} onValueChange={setTab} className='w-full flex justify-center min-h-[700px]'>
            <TabsList className='grid w-full grid-cols-2 border-slate-700 bg-gray-400'>
                <TabsTrigger value="1">{t("channel")} 1</TabsTrigger>
                <TabsTrigger value="2">{t("channel")} 2</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <div className=''>
                    <MoonPayBuyWidget
                        style={{ width: '100%', minHeight: 900, backgroundColor: "transparent", margin: 0, border: "none"}}
                        variant="embedded"
                        baseCurrencyCode="usd"
                        defaultCurrencyCode="eth"
                        language=''
                    />
                </div>

            </TabsContent>
            <TabsContent value="2">
                <div id='transak-widget' className='h-[900px]'></div>
            </TabsContent>
        </Tabs>
    </MoonPayProvider>
}   