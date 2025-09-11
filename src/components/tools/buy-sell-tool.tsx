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

        <div className="w-full max-w-lg mx-auto space-y-4">
            <Card className="bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                            <BuySellCryptoIcon color='cyan' className={''} />
                            Buy/Sell Crypto
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className='border-none'>
                    <MoonPayBuyWidget
                        style={{ width: '100%', backgroundColor: "transparent", margin: 0, border: "none" }}
                        variant="embedded"
                        baseCurrencyCode="usd"
                        defaultCurrencyCode="eth"
                        language=''
                    />
                </CardContent>
            </Card>
        </div>
    </MoonPayProvider>
}   