"use client"
import BuySellCryptoIcon from '@/res/BuySellCryptoIcon';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import dynamic from 'next/dynamic';

const MoonPayProvider = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayProvider),
    { ssr: false },
);

const MoonPayBuyWidget = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayBuyWidget),
    { ssr: false },
);

export const BuySellCryptoTool = () => {
    return <MoonPayProvider apiKey={process.env.NEXT_PUBLIC_MOONPAY_API_KEY} debug>
        <div className="">
            <MoonPayBuyWidget
                style={{ width: '100%', minHeight: 900, backgroundColor: "transparent", margin: 0, border: "none" }}
                variant="embedded"
                baseCurrencyCode="usd"
                defaultCurrencyCode="eth"
                language=''
            />
        </div>
    </MoonPayProvider>
}   