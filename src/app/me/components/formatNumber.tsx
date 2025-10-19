export default function FormatNumber(value?: number | string | null) {
  if (value == null) return "0";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("ko-KR");
}
