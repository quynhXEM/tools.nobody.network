import { sendCoin } from "@/libs/token";
import { fetchAppMetadata } from "@/libs/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const metadata = await fetchAppMetadata();
    const body = await req.json();
    const privateKey = metadata?.custom_fields?.masterWallet.private_key;
    const { amount, to, rpc, chain_id } = body;
    if (!amount || !rpc || !privateKey || !to || !chain_id) {
      return NextResponse.json(
        { success: false, error: "Thiếu tham số" },
        { status: 400 }
      );
    }
    const txHash = await sendCoin({ amount, rpc, privateKey, to, chain_id });
    return NextResponse.json({ success: true, txHash });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Giao dịch thất bại" },
      { status: 500 }
    );
  }
}
