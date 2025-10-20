import KakaoScriptLoader from "@/app/activities/components/KakaoScriptLoader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <KakaoScriptLoader />
      {children}
    </div>
  );
}
