import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { domain } = await req.json();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/domain/check?domain=${domain}&currency=CREDIT`,
      {
        method: "GET",
        headers: myHeaders,
      }
    ).then((data) => {
      return data.json();
    });
    
    return NextResponse.json({ ok: true, result: response });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error });
  }
};
