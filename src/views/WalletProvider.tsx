"use client"

import { useUserWallet } from "@/app/commons/UserWalletContext"
import { useEffect } from "react";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const { connectWallet, disconnect, setLoading } = useUserWallet();

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            typeof window.ethereum !== "undefined"
        ) {
            const connected = sessionStorage.getItem("idscoin_connected");
            if (connected) {
                connectWallet();
            } else {
                setLoading(false)
            }

            window.ethereum.on("accountsChanged", (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnect();
                } else {
                    connectWallet();
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <>{children}</>
}