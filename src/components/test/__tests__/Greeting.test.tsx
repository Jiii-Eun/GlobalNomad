import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import Greeting from "../Greeting";

// 테스트마다 새로운 QueryClient 생성
function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("Greeting Component", () => {
  test("API 데이터를 렌더링한다", async () => {
    renderWithClient(<Greeting />);

    // 로딩 상태 확인
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // API 데이터가 나타나는지 확인
    await waitFor(() => expect(screen.getByText("Hello from API")).toBeInTheDocument());
  });
});
