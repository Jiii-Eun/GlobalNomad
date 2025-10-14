import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function proxy(req: NextRequest, method: string, params: string[]) {
  const targetUrl = `${BASE_URL}/${params.join("/")}${req.nextUrl.search}`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const headers = new Headers(req.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  headers.delete("accept-encoding");

  let body: BodyInit | undefined = undefined;
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

  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      credentials: "include",
    });

    if (refreshRes.ok) {
      const tokens = await refreshRes.json();
      const nextRes = NextResponse.next();

      nextRes.cookies.set("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      nextRes.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      res = await fetch(targetUrl, { method, headers, body });
    }
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(req: NextRequest, context: any) {
  return proxy(req, "GET", context.params.proxy);
}
export async function POST(req: NextRequest, context: any) {
  return proxy(req, "POST", context.params.proxy);
}
export async function PUT(req: NextRequest, context: any) {
  return proxy(req, "PUT", context.params.proxy);
}
export async function PATCH(req: NextRequest, context: any) {
  return proxy(req, "PATCH", context.params.proxy);
}
export async function DELETE(req: NextRequest, context: any) {
  return proxy(req, "DELETE", context.params.proxy);
}
