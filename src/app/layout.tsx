import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { chakraPetch } from "@/assets/font";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { fetchAppMetadata } from "@/libs/utils";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  let locale = cookieStore.get("NEXT_LOCALE")?.value;
  const metadata = await fetchAppMetadata(locale);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_API_URL}/assets/${metadata?.icon}/ids-coin.svg`} />
      </head>
      {/* GA Scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <body className={`${chakraPetch.variable} antialiased`}>
        {children}
        <Analytics />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(error) {
                    console.log('SW registration failed: ', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
