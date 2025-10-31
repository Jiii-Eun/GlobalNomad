export type KakaoIntent = "signin" | "signup";

export function buildKakaoAuthUrl(intent: KakaoIntent) {
  const REST_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const REDIRECT = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  if (!REST_KEY) throw new Error("Missing NEXT_PUBLIC_KAKAO_REST_API_KEY");
  if (!REDIRECT) throw new Error("Missing NEXT_PUBLIC_KAKAO_REDIRECT_URI");

  const redirectUri = encodeURIComponent(REDIRECT);
  const scope = encodeURIComponent("profile_nickname");
  const state = encodeURIComponent(`${intent}:${crypto?.randomUUID?.() ?? Date.now()}`);

  return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_KEY}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
}

export function rememberKakaoStateFromUrl(url: string) {
  try {
    const u = new URL(url);
    const state = u.searchParams.get("state");
    if (state) sessionStorage.setItem("kakao_oauth_state", state);
  } catch {
    /* */
  }
}

export function verifyKakaoState(returnedState: string | null): boolean {
  const saved = sessionStorage.getItem("kakao_oauth_state");
  return saved ? saved === (returnedState ?? "") : true;
}
