
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { fetchAppMetadata } from "@/libs/utils";
import { AppMetadataProvider } from "../commons/AppMetadataContext";
import { NotificationProvider } from "../commons/NotificationContext";
import { UserWalletProvider } from "../commons/UserWalletContext";
import { Toaster } from "@/components/ui/toaster"
import { cookies } from "next/headers";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const metadata = await fetchAppMetadata(resolvedParams.lang);
  return {
    title: metadata?.translation?.[0]?.name,
    description: metadata?.translation[0]?.description,
    icons: {
      icon: `${process.env.NEXT_PUBLIC_API_URL}/assets/${metadata?.icon}/ids-coin.svg?v=${Date.now()}`
    }
  };
}


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  let locale = cookieStore.get("NEXT_LOCALE")?.value;
  const messages = await getMessages();
  const metadata = await fetchAppMetadata(locale);
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
