import { useUserWallet } from "@/app/commons/UserWalletContext";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";
import { useTranslations } from "next-intl"


export const NotConnectLayout = ({ children }: { children: React.ReactNode }) => {
    const t = useTranslations();
    const { isConnected, connectWallet, loading } = useUserWallet()

    if (isConnected) {
        return children
    }
    return (
            <CardContent>
                <div className="flex flex-col items-center text-center py-8">
                <Wallet className="w-12 h-12 text-gray-400"/>
                <h3 className="text-lg font-semibold text-white mb-2">{t("wait.connect_view")}</h3>
                <p className="text-gray-400 text-sm mb-4">{t("wait.sub_connect")}</p>
                <Button
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer disabled:cursor-not-allowed"
                    onClick={() => connectWallet()}
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wallet className="w-4 h-4 mr-2" />}
                    {t("wait.connect_btn")}
                </Button>
            </div>
        </CardContent>
    )
}