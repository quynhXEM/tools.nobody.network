
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation"
import { SimplifiedToolLayout } from "@/components/simplified-tool-layout"
import { ImprovedTokenDeployTool } from "@/components/tools/improved-token-deploy-tool"
import { MultiSendTool } from "@/components/tools/multi-send-tool"
import { LiquidityTool } from "@/components/tools/liquidity-tool"
import { AirdropTool } from "@/components/tools/airdrop-tool"
import { TransactionDecoderTool } from "@/components/tools/transaction-decoder-tool"

export const generateMetadata = async () => {
    const t = await getTranslations();

    return {
        title: t("title"),
    };
};

const tools = {
  "token-deploy": {
    title: "Deploy Token",
    description: "Deploy ERC-20 tokens on blockchain",
    component: ImprovedTokenDeployTool,
  },
  "transaction-decoder": {
    title: "Transaction Decoder",
    description: "Decode hex transaction data to JSON",
    component: TransactionDecoderTool,
  },
  "multi-send": {
    title: "Multi Send",
    description: "Send tokens to multiple addresses",
    component: MultiSendTool,
  },
  "liquidity-manager": {
    title: "Liquidity Manager",
    description: "Manage DEX liquidity pools",
    component: LiquidityTool,
  },
  "airdrop-manager": {
    title: "Airdrop Manager",
    description: "Distribute tokens via airdrop",
    component: AirdropTool,
  },
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = tools[params.slug as keyof typeof tools]

  if (!tool) {
    notFound()
  }

  const ToolComponent = tool.component

  return (
    <SimplifiedToolLayout title={tool.title} description={tool.description}>
      <ToolComponent />
    </SimplifiedToolLayout>
  )
}
