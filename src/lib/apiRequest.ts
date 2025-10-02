const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends Omit<RequestInit, "body"> {
  isFormData?: boolean;
  data?: unknown;
}

export async function apiRequest<Response>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { isFormData, headers, data, ...rest } = options;

  const fetchOptions: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      ...(headers as Record<string, string>),
    },
  };

  // 이미지 전송 구분
  if (!isFormData && data !== undefined) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify(data);
  } else if (isFormData) {
    fetchOptions.body = data as FormData;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  // 인증 오류 처리
  if (response.status === 401) {
    throw new Error("인증 실패: 다시 로그인하세요");
  }

  // 콘텐츠 없을 때
  if (response.status === 204) return undefined as Response;

  // 생성했을 때
  if (response.status === 201) return response.json() as Promise<Response>;

  // 에러
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "API 요청 실패");
  }

  return response.json();
}
