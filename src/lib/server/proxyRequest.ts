import { NextRequest, NextResponse } from "next/server";

import { BASE_URL } from "./constants";
import { setAuthCookies } from "./tokens";

export async function proxyRequest(req: NextRequest, method: string, endpoint: string) {
  try {
    const url = ["GET", "DELETE"].includes(method)
      ? `${BASE_URL}/${endpoint}${req.nextUrl.search}`
      : `${BASE_URL}/${endpoint}`;

    const cookieHeader = req.headers.get("cookie") ?? "";
    const accessToken = cookieHeader.match(/accessToken=([^;]+)/)?.[1];
    const refreshToken = cookieHeader.match(/refreshToken=([^;]+)/)?.[1];

    const headers: Record<string, string> = {
      Cookie: cookieHeader,
    };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    let body: BodyInit | undefined;
    if (!["GET", "HEAD", "DELETE"].includes(method)) {
      const contentType = req.headers.get("content-type") ?? "";
      if (contentType.includes("multipart/form-data")) {
        body = await req.formData();
      } else {
        body = await req.text();
        headers["content-type"] = contentType;
      }
    }

    let res = await fetch(url, { method, headers, body, credentials: "include" });

    if (res.status === 401 && refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/tokens`, {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
        credentials: "include",
      });

      if (refreshRes.ok) {
        const tokens = await refreshRes.json();
        headers["Authorization"] = `Bearer ${tokens.accessToken}`;
        res = await fetch(url, { method, headers, body, credentials: "include" });

        const nextRes = new NextResponse(await res.text(), {
          status: res.status,
          headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
        });

        return setAuthCookies(nextRes, tokens);
      }
    }

    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    console.error("[proxyRequest] Error:", error);
    return NextResponse.json(
      { message: "Proxy request failed", error: String(error) },
      { status: 500 },
    );
  }
}
