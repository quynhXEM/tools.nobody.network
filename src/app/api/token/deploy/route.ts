import { fetchAppMetadata } from "@/libs/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const {
      custom_fields: { chain_info },
    } = await fetchAppMetadata();
    const { name, symbol, totalSupply, decimals, chainId } = await req.json();
    const getChainInfo = (chain_id: any) => {
      const chain = chain_info?.[chainId];
      return chain;
    };

    const chain = getChainInfo(chainId);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer eG2Lf8736fN8hStkXHaEeJGMKtmDV4Tv`);
    const response = await fetch(
      `https://dev.directus.vn/api-crypto/crypto/token/deploy-with-new-wallet`,
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
      return data.json();
    });
    return NextResponse.json({ ok: true, result: response });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error });
  }
};
