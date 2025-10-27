import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");
  if (!src) return new NextResponse("src required", { status: 400 });

  try {
    const upstream = await fetch(src);
    if (!upstream.ok) return new NextResponse("fetch failed", { status: upstream.status });

    const contentType = upstream.headers.get("content-type") || "image/png";
    const cache = upstream.headers.get("cache-control") || "public, max-age=31536000, immutable";
    const buf = await upstream.arrayBuffer();

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cache,
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new NextResponse("proxy error", { status: 502 });
  }
}
