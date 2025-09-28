import { http, HttpResponse } from "msw";

// 예시: 유저 정보 요청 가로채기
export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
