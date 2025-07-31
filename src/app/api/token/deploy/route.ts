import { fetchAppMetadata } from "@/libs/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const {
      custom_fields: { usdt_payment_wallets },
    } = await fetchAppMetadata();
    const { name, symbol, totalSupply, decimals, chainId } = await req.json();
    const getChainInfo = (chain_id: any) => {
      const chain = usdt_payment_wallets.find(
        (opt: any) => opt.chain_id === Number(chain_id)
      );
      return chain;
    };

    const chain = getChainInfo(chainId);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.API_TOKEN || ""}`);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api-crypto/crypto/token/deploy-with-new-wallet`,
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          name: name,
          symbol: symbol,
          totalSupply: totalSupply,
          decimals: decimals,
          chainId: chainId,
          privateKey: chain.private_key,
        }),
      }
    ).then((data) => {
      console.log("data", data);

      return data.json();
    });

    console.log("response", response);

    return NextResponse.json({ ok: true, result: response });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ ok: false, error: error });
  }
};
