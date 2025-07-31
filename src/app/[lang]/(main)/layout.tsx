"use client"

import LocaleDropdown from "@/app/commons/LocaleDropdown";
import WalletConnect from "@/app/commons/WalletConnect";
import { SideBar } from "@/views/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="bg-blue-300/20 h-screen w-screen px-2 flex flex-col">
        <div className="w-full flex-shrink-0 py-1">
            <div className="flex justify-between items-center">
                <div className="flex items-center justify-start">
                    <div className="w-6">
                        <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g clipRule="evenodd" fill="#0665D0" fillRule="evenodd"><path d="m7.734 4.192c-1.162-.79-2.734.042-2.734 1.448v4.722c0 1.405 1.572 2.237 2.734 1.447l3.472-2.36a1.75 1.75 0 0 0 0-2.895l-3.472-2.36zm-1.234 1.448c0-.2.225-.32.39-.206l3.472 2.36a.25.25 0 0 1 0 .414l-3.471 2.36a.25.25 0 0 1 -.391-.206v-4.723z" /><path d="m7.25 0a1.75 1.75 0 0 0 -1.75 1.728 6.715 6.715 0 0 0 -.167.07 1.75 1.75 0 0 0 -2.46.015l-1.06 1.06a1.75 1.75 0 0 0 -.015 2.46 6.712 6.712 0 0 0 -.07.167 1.75 1.75 0 0 0 -1.728 1.75v1.5c0 .96.772 1.738 1.728 1.75l.07.167a1.75 1.75 0 0 0 .015 2.46l1.06 1.06a1.75 1.75 0 0 0 2.46.015l.167.07a1.75 1.75 0 0 0 1.75 1.728h1.5a1.75 1.75 0 0 0 1.75-1.728l.167-.07a1.75 1.75 0 0 0 2.46-.015l1.06-1.06a1.75 1.75 0 0 0 .015-2.46l.07-.167a1.75 1.75 0 0 0 1.728-1.75v-1.5a1.75 1.75 0 0 0 -1.728-1.75 6.185 6.185 0 0 0 -.07-.167 1.75 1.75 0 0 0 -.015-2.46l-1.06-1.06a1.75 1.75 0 0 0 -2.46-.015 6.794 6.794 0 0 0 -.167-.07 1.75 1.75 0 0 0 -1.75-1.728zm-.25 1.75a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.51c0 .33.216.62.532.717.326.1.64.23.936.388a.75.75 0 0 0 .884-.131l.36-.36a.25.25 0 0 1 .354 0l1.06 1.06a.25.25 0 0 1 0 .354l-.36.36a.75.75 0 0 0 -.131.884c.158.296.289.61.388.936a.75.75 0 0 0 .718.532h.509a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1 -.25.25h-.51a.75.75 0 0 0 -.717.532c-.1.326-.23.64-.388.936a.75.75 0 0 0 .131.884l.36.36a.25.25 0 0 1 0 .354l-1.06 1.06a.25.25 0 0 1 -.354 0l-.36-.36a.75.75 0 0 0 -.884-.131c-.296.158-.61.289-.936.388a.75.75 0 0 0 -.532.718v.509a.25.25 0 0 1 -.25.25h-1.5a.25.25 0 0 1 -.25-.25v-.51a.75.75 0 0 0 -.532-.717c-.326-.1-.64-.23-.936-.388a.75.75 0 0 0 -.884.131l-.36.36a.25.25 0 0 1 -.354 0l-1.06-1.06a.25.25 0 0 1 0-.354l.36-.36a.75.75 0 0 0 .131-.884 5.213 5.213 0 0 1 -.388-.936.75.75 0 0 0 -.718-.532h-.509a.25.25 0 0 1 -.25-.25v-1.5a.25.25 0 0 1 .25-.25h.51a.75.75 0 0 0 .717-.532c.1-.326.23-.64.388-.936a.75.75 0 0 0 -.131-.884l-.36-.36a.25.25 0 0 1 0-.354l1.06-1.06a.25.25 0 0 1 .354 0l.36.36a.75.75 0 0 0 .884.131c.296-.158.61-.289.936-.388a.75.75 0 0 0 .532-.718z" /></g></svg>
                    </div>
                    <p className="ml-1 font-bold text-[#0665D0]">TOOLS NOBODY</p>
                </div>
                <div className="flex items-center gap-1 justify-end">
                    <LocaleDropdown />
                    <WalletConnect />
                </div>
            </div>
        </div>
        <div className="flex-1 min-h-0 flex">
            <SideBar/>
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