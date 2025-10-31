export const formatKRW = (n?: number) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("ko-KR") : "";

export const parseKRW = (s: string) => {
  const digits = s.replace(/[^\d]/g, ""); // 숫자만 추출
  return digits ? Number(digits) : NaN; // 빈문자면 NaN
};
