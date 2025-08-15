
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { fetchAppMetadata } from "@/libs/utils";
import { AppMetadataProvider } from "../commons/AppMetadataContext";
import { NotificationProvider } from "../commons/NotificationContext";
import { UserWalletProvider } from "../commons/UserWalletContext";
import { Toaster } from "@/components/ui/toaster"
import { cookies, headers } from "next/headers";
import { GATracker } from "@/views/GATracker";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
const tools = {
  "token-deploy": {
    title: "Deploy Token",
    description: "token.deploydec",
  },
  "transaction-decoder": {
    title: "Transaction Decoder",
    description: "tx.desc",
  },
  "multi-send": {
    title: "Multi Send",
    description: "multi.desc",
  },
  "liquidity-manager": {
    title: "Liquidity Manager",
    description: "liquidity.desc",
  },
  "airdrop-manager": {
    title: "Airdrop Manager",
    description: "airdrop.desc",
  },
}

// export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
//   const resolvedParams = await params;
//   const metadata = await fetchAppMetadata(resolvedParams.lang);
//   const t = await getTranslations();

//   // Lấy thông tin URL hiện tại để xác định trang
//   const headersList = await headers();
//   const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';

//   // Tách slug từ pathname (ví dụ: /vi-VN/tools/token-deploy -> token-deploy)
//   const pathSegments = pathname.split('/');
//   const toolsIndex = pathSegments.indexOf('tools');
//   const slug = toolsIndex !== -1 && pathSegments[toolsIndex + 1] ? pathSegments[toolsIndex + 1] : '';

//   // Tìm tool từ slug
//   const tool = slug ? tools[slug as keyof typeof tools] : null;

//   // Tạo metadata dựa trên trang hiện tại
//   if (tool) {
//     // Nếu là trang tool
//     return {
//       title: `${tool.title}`,
//       description: t(tool.description),
//     };
//   } else {
//     // Metadata mặc định cho các trang khác
//     return {
//       title: metadata?.translation?.[0]?.name,
//       description: metadata?.translation?.[0]?.description,
//     };
//   }
// }

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
              <GATracker />
              {children}
              <Toaster />
            </UserWalletProvider>
          </NotificationProvider>
        </AppMetadataProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
