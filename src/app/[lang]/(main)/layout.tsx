"use client"

import LocaleDropdown from "@/app/commons/LocaleDropdown";
import WalletConnect from "@/app/commons/WalletConnect";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="bg-blue-300/20 h-screen w-screen px-2 flex flex-col">
        <div className="w-full flex-shrink-0 py-1">
            <div className="flex justify-between items-center">
                <div className="flex items-center justify-start">
                    SOC LOGO
                </div>
                <div className="flex items-center gap-1 justify-end">
                    <LocaleDropdown />
                    <WalletConnect />
                </div>
            </div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 bg-white rounded-sm p-2 border-1 overflow-auto min-h-0">
                {children}
            </div>
        </div>
        <div className="w-full flex-shrink-0">
            <div className="flex justify-center items-center mt-2 mb-2">
                <p className="text-xs text-gray-500">Copyright @ {new Date().getFullYear()} <a className="text-blue-700 font-semibold" href="https://soc.com" target="_blank" rel="noopener noreferrer">SOC JSC</a></p>
            </div>
        </div>
    </div>
}