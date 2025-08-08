
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { fetchAppMetadata } from "@/libs/utils";
import { AppMetadataProvider } from "../commons/AppMetadataContext";
import { NotificationProvider } from "../commons/NotificationContext";
import { UserWalletProvider } from "../commons/UserWalletContext";
import { Toaster } from "@/components/ui/toaster"
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
              <Toaster />
            </UserWalletProvider>
          </NotificationProvider>
        </AppMetadataProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
