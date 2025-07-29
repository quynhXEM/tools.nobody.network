
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { fetchAppMetadata } from "@/libs/utils";
import { AppMetadataProvider } from "../commons/AppMetadataContext";
import { NotificationProvider } from "../commons/NotificationContext";
import { UserWalletProvider } from "../commons/UserWalletContext";
import LocaleDropdown from "../commons/LocaleDropdown";
import WalletConnect from "../commons/WalletConnect";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const metadata = await fetchAppMetadata();
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AppMetadataProvider initialMetadata={metadata}>
          <NotificationProvider>
            <UserWalletProvider>
              <div className="bg-blue-300/20 h-screen w-screen px-2 flex flex-col">
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
            </UserWalletProvider>
          </NotificationProvider>
        </AppMetadataProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
