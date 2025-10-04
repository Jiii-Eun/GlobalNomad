import { cookies } from "next/headers";
import { describe, it, expect, vi, beforeEach, MockInstance } from "vitest";

import { POST } from "./route";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("리프레시 토큰이 없으면 401 반환", async () => {
    (cookies as unknown as MockInstance).mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
    });

    const res = await POST();

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("리프레시 토큰이 없습니다. 다시 로그인하세요.");
  });

  it("리프레시 토큰이 있으면 새 토큰 발급 성공", async () => {
    (cookies as unknown as MockInstance).mockReturnValue({
      get: vi.fn().mockReturnValue({ value: "mock-refresh" }),
    });

    // fetch 모킹
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        accessToken: "mock-access",
        refreshToken: "mock-refresh",
      }),
    }) as unknown as typeof fetch;

    const res = await POST();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.accessToken).toBe("mock-access");
    expect(body.refreshToken).toBe("mock-refresh");
  });
});
