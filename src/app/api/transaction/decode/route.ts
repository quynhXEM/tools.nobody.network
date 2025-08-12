import { decodeTransaction } from "@/libs/ethers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { txHash, chainId, rpcUrl } = await req.json();
    const result = await decodeTransaction({ txHash, rpcUrl, chainId });
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.log(error);

    const message = error?.error?.message || error.toString();
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
};
