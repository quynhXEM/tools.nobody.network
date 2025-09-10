import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { chainId, sellToken, buyToken, sellAmount, taker, swapFeeRecipient, swapFeeBps } =
      await req.json();
    const myHeaders = new Headers();
    myHeaders.append("0x-api-key", process.env.ZEROEX_API_KEY || "");
    myHeaders.append("0x-version", "v2");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const respone = await fetch(
      `https://api.0x.org/swap/permit2/quote?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}&swapFeeRecipient=${swapFeeRecipient}&swapFeeBps=${swapFeeBps}&swapFeeToken=${sellToken}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => result);

    return NextResponse.json({ ok: true, result: respone });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error });
  }
};
