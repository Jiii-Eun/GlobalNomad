import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Vitest 같은 Node.js 테스트 러너에서 사용
export const server = setupServer(...handlers);
