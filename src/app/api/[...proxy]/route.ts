import { NextRequest } from "next/server";

import { proxyRequest } from "@/lib/server/proxyRequest";

function makeHandler(method: string) {
  return async (req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) => {
    const endpoint = (await params).proxy.join("/");
    return proxyRequest(req, method, endpoint);
  };
}

export const GET = makeHandler("GET");
export const POST = makeHandler("POST");
export const PUT = makeHandler("PUT");
export const PATCH = makeHandler("PATCH");
export const DELETE = makeHandler("DELETE");
