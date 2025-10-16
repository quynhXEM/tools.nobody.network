import { estimateGasFee } from "@/libs/token";
import { fetchAppMetadata } from "@/libs/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      custom_fields: { masterWallet },
    } = await fetchAppMetadata();
    const { rpc, chain_id, type, walletlist, tokenAddress } = await req.json();
    const result = await estimateGasFee({
      walletlist,
      type,
      tokenAddress,
      chain_id,
      rpc,
      privateKey: masterWallet.private_key,
    });
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    const message = error?.error?.message || error.toString();
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
};
