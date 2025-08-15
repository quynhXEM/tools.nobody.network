import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { chakraPetch } from "@/assets/font";
import { fetchAppMetadata } from "@/libs/utils";
import { cookies, headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  let locale = cookieStore.get("NEXT_LOCALE")?.value;
  const metadata = await fetchAppMetadata(locale);
  const iconId = metadata?.icon;
  const faviconUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/assets/${iconId}/ids-coin.svg?v=${Date.now()}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconUrl} />
        <meta name="description" content={metadata?.translation?.[0]?.description} />
        <title>{metadata?.translation?.[0]?.name}</title>
      </head>
      <body className={`${chakraPetch.variable} antialiased`}>
        {children}
        <Analytics/>
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
