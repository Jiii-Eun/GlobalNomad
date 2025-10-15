import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function proxy(req: NextRequest, method: string): Promise<NextResponse> {
  const targetUrl = `${BASE_URL}/auth/refresh${req.nextUrl.search}`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const headers = new Headers(req.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  headers.delete("accept-encoding");

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const contentType = headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
      headers.delete("content-type");
      headers.delete("content-length");
    } else {
      body = await req.text();
    }
  }

  let res = await fetch(targetUrl, { method, headers, body });

  // 토큰 재발급 처리
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      credentials: "include",
    });

    if (refreshRes.ok) {
      const tokens: { accessToken: string; refreshToken: string } = await refreshRes.json();
      const nextRes = NextResponse.next();

      for (const [key, value] of Object.entries(tokens)) {
        nextRes.cookies.set(key, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }

      headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      res = await fetch(targetUrl, { method, headers, body });
    }
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}
export async function POST(req: NextRequest) {
  return proxy(req, "POST");
}
export async function PUT(req: NextRequest) {
  return proxy(req, "PUT");
}
export async function PATCH(req: NextRequest) {
  return proxy(req, "PATCH");
}
export async function DELETE(req: NextRequest) {
  return proxy(req, "DELETE");
}
