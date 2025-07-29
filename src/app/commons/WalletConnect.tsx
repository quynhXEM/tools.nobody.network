"use client"
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import { useUserWallet } from "./UserWalletContext";


export default function WalletConnect() {
    const { wallet, connectWallet, disconnect } = useUserWallet()
    return <>
        {!wallet ?
            <Button onClick={connectWallet} variant="ghost" size={"sm"} className="cursor-pointer outline-none border-none ">
                <WalletIcon />
            </Button>
            :
            <Button onClick={disconnect} variant="ghost" size={"sm"} className="cursor-pointer outline-none border-none ">
                <WalletIcon />
                {wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4)}
            </Button>
        }
    </>;
}