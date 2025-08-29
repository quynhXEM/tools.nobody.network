import { fetchAppMetadata } from "@/libs/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const {
      custom_fields: { masterWallet }
    } = await fetchAppMetadata();
    const { name, symbol, totalSupply, decimals, chainId } = await req.json();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.SOC_TOKEN}`);
    console.log({
      name: name,
      symbol: symbol,
      totalSupply: totalSupply,
      decimals: decimals,
      chainId: chainId,
      currency: "CREDIT",
      privateKey: masterWallet.private_key,
    });
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAINLIST_API_URL}/api-crypto/crypto/token/deploy-with-new-wallet`,
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          name: name,
          symbol: symbol,
          totalSupply: totalSupply,
          decimals: decimals,
          chainId: chainId,
          currency: "CREDIT",
          privateKey: masterWallet.private_key,
        }),
      }
    ).then((data) => {
      return data.json();
    });
    return NextResponse.json({ ok: true, result: response });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error });
  }
};
