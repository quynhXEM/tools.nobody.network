import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { chakraPetch } from "@/assets/font";
import { fetchAppMetadata } from "@/libs/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Tools PWA",
  description: "Professional crypto tools for token management and blockchain operations",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metadata = await fetchAppMetadata();
  const iconId = metadata?.icon;
  const faviconUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/assets/${iconId}/ids-coin.svg?v=${Date.now()}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconUrl} />
        <title>{metadata?.name}</title>
      </head>
      <body className={`${chakraPetch.variable} antialiased`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
