
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
              {children}
            </UserWalletProvider>
          </NotificationProvider>
        </AppMetadataProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
