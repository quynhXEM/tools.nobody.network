import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crypto Tools PWA",
    short_name: "CryptoTools",
    description: "Professional crypto tools for token management and blockchain operations",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["finance", "productivity", "utilities"],
    orientation: "portrait-primary",
  }
}
