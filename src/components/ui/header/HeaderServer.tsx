import { cookies } from "next/headers";

import Header from "@/components/ui/header";

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  const hasRefresh = !!refreshToken;

  return <Header hasRefresh={hasRefresh} />;
}
