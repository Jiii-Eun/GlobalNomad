import { NextRequest, NextResponse } from "next/server";

import { BASE_URL } from "@/lib/server/constants";
import { setAuthCookies } from "@/lib/server/tokens";

export async function proxyRequest(req: NextRequest, method: string, endpoint: string) {
  try {
    const url = ["GET", "DELETE"].includes(method)
      ? `${BASE_URL}/${endpoint}${req.nextUrl.search}`
      : `${BASE_URL}/${endpoint}`;

    const cookieHeader = req.headers.get("cookie") ?? "";
    const accessToken = cookieHeader.match(/accessToken=([^;]+)/)?.[1];
    const refreshToken = cookieHeader.match(/refreshToken=([^;]+)/)?.[1];

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

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

    const res = await fetch(url, { method, headers, body, credentials: "include" });

    if (res.status === 401) {
      if (refreshToken) {
        const refreshRes = await fetch(`${BASE_URL}/auth/tokens`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (refreshRes.ok) {
          const tokens = await refreshRes.json();
          headers["Authorization"] = `Bearer ${tokens.accessToken}`;
          const retriedRes = await fetch(url, { method, headers, body, credentials: "include" });

          const nextRes = new NextResponse(await retriedRes.text(), {
            status: retriedRes.status,
            headers: {
              "content-type": retriedRes.headers.get("content-type") ?? "application/json",
            },
          });

          return setAuthCookies(nextRes, tokens);
        }
      }

      return NextResponse.json({ message: "Unauthorized (refresh expired)" }, { status: 200 });
    }

    const contentType = res.headers.get("content-type");
    const text = await res.text();

    if (res.status === 204 || !text) {
      return new NextResponse(null, { status: res.status });
    }

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": contentType ?? "application/json",
      },
    });
  } catch (error) {
    console.error("[proxyRequest] Error:", error);
    return NextResponse.json(
      { message: "Proxy request failed", error: String(error) },
      { status: 500 },
    );
  }
}
