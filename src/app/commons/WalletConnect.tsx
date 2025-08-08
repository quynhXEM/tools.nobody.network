"use client"
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import { useUserWallet } from "./UserWalletContext";


export default function WalletConnect() {
    const { wallet, connectWallet, disconnect, loading } = useUserWallet()
    return <>
        {!wallet ?
            <Button onClick={connectWallet} variant="default" size={"sm"} className="cursor-pointer outline-none border-none bg-white text-black hover:bg-gray-200">
                <p className="text-xs">{loading ? "Đang kết nối ví" : "Kết nối ví"}</p>
            </Button>
            :
            <Button onClick={disconnect} variant="ghost" size={"sm"} className="cursor-pointer outline-none border-none bg-white text-black hover:bg-gray-200">
                <WalletIcon />
                {wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4)}
            </Button>
        }
    </>;
}