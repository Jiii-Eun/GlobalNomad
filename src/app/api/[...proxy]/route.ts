import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ProxyContext {
  params: Promise<{ proxy: string[] }>;
}

export async function GET(req: NextRequest, { params }: ProxyContext) {
  const endpoint = (await params).proxy.join("/");
  const url = `${BASE_URL}/${endpoint}${req.nextUrl.search}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error) {
    console.error("[proxy GET]", error);
    return NextResponse.json(
      { message: "프록시 GET 요청 실패", error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest, { params }: ProxyContext) {
  const endpoint = (await params).proxy.join("/");
  const url = `${BASE_URL}/${endpoint}`;
  const body = await req.text();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      credentials: "include",
    });

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error) {
    console.error("[proxy POST]", error);
    return NextResponse.json(
      { message: "프록시 POST 요청 실패", error: String(error) },
      { status: 500 },
    );
  }
}
