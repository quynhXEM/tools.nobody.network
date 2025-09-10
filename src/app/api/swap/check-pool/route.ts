import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { chainId, sellToken, buyToken, sellAmount, taker } =
      await req.json();
    const myHeaders = new Headers();
    myHeaders.append("0x-api-key", "f4b909b5-056e-4d85-a851-8f202e73876d");
    myHeaders.append("0x-version", "v2");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const respone = await fetch(
      `https://api.0x.org/swap/permit2/quote?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => result);

    return NextResponse.json({ ok: true, result: respone });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error });
  }
};
