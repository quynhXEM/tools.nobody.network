
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation"
import { SimplifiedToolLayout } from "@/components/simplified-tool-layout"
import { ImprovedTokenDeployTool } from "@/components/tools/improved-token-deploy-tool"
import { MultiSendTool } from "@/components/tools/multi-send-tool"
import { LiquidityTool } from "@/components/tools/liquidity-tool"
import { AirdropTool } from "@/components/tools/airdrop-tool"
import { TransactionDecoderTool } from "@/components/tools/transaction-decoder-tool"
import { Coins, Droplets, FileText, Gift, Send } from "lucide-react";
import { Metadata } from "next";
import { WalletProvider } from "@/views/WalletProvider";
import DeployChainIcon from "@/res/DeployChainIcon";
import ChainBuilderTool from "@/components/tools/chain-builder";
import { SwapToolsPage } from "@/components/tools/swap-tool";

const tools = {
  "token-deploy": {
    title: "Deploy Token",
    description: "token.deploydec",
    component: ImprovedTokenDeployTool,
    icon: Coins,
    color: "from-blue-500 to-cyan-500",
  },
  "transaction-decoder": {
    title: "Transaction Decoder",
    description: "tx.desc",
    component: TransactionDecoderTool,
    icon: FileText,
    color: "from-violet-500 to-purple-500",
  },
  "chain-builder": {
    title: "Chain Builder",
    description: "chainbuilder",
    component: ChainBuilderTool,
    icon: DeployChainIcon,
    color: "from-cyan-500 to-emerald-500",
  },
  "swap-crypto": {
    title: "Swap Crypto",
    description: "swap.desc",
    component: SwapToolsPage,
    icon: DeployChainIcon,
    color: "from-cyan-500 to-emerald-500",
  },
  "multi-send": {
    title: "Multi Send",
    description: "multi.desc",
    component: MultiSendTool,
    icon: Send,
    color: "from-green-500 to-emerald-500",
  },
  "liquidity-manager": {
    title: "Liquidity Manager",
    description: "liquidity.desc",
    component: LiquidityTool,
    icon: Droplets,
    color: "from-purple-500 to-pink-500",
  },
  "airdrop-manager": {
    title: "Airdrop Manager",
    description: "airdrop.desc",
    component: AirdropTool,
    icon: Gift,
    color: "from-orange-500 to-red-500",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations();
  const tool = tools[resolvedParams.slug as keyof typeof tools];
  return {
    title: tool.title,
    description: t(tool.description),
  };
}


export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tool = tools[resolvedParams.slug as keyof typeof tools];
  const t = await getTranslations();
  if (!tool) {
    notFound()
  }

  const ToolComponent = tool.component

  return (
    <SimplifiedToolLayout title={tool.title} description={t(tool.description)} icon={tool.icon} color={tool.color}>
      <WalletProvider>
      <ToolComponent />
      </WalletProvider>
    </SimplifiedToolLayout>
  )
}
