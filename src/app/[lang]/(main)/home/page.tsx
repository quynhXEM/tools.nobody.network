import { fetchAppMetadata } from "@/libs/utils";
import Home from "@/views/home/Home"
import { WalletProvider } from "@/views/WalletProvider";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const metadata = await fetchAppMetadata(resolvedParams.lang);
  return {
    title: metadata?.translation?.[0]?.name,
    description: metadata?.translation?.[0]?.description,
  };
}

export default function HomePage() {
  return (
    <WalletProvider>
      <Home />
    </WalletProvider>
  )
}