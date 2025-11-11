import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { name, symbol, totalSupply, decimals, chainId, type, private_key } = await req.json();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.API_TOKEN}`);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/crypto/token/deploy/estimate-fee`,
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          name: name,
          symbol: symbol,
          totalSupply: totalSupply,
          decimals: decimals,
          chainId: chainId,
          type: type,
          currency: "CREDIT",
          privateKey: private_key,
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
