import { decodeTransaction } from "@/libs/ethers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { txHex } = await req.json();
    const result = await decodeTransaction({ txHex });
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    const message = error?.error?.message || error.toString();
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
};
