"use client";

import { useState } from "react";

import { useLogin, useLogout } from "@/lib/api/auth/hooks";

export default function TestLoginPage() {
  const [email, setEmail] = useState("test00@email.com");
  const [password, setPassword] = useState("12345678");

  // ✅ 로그인 훅
  const loginMutation = useLogin(false, {
    onSuccess: (data) => {
      alert("✅ 로그인 성공!");
      console.log("로그인 성공:", data);
    },
    onError: (err) => {
      alert("❌ 로그인 실패: " + (err instanceof Error ? err.message : "unknown error"));
      console.error("로그인 실패:", err);
    },
  });

  // ✅ 로그아웃 훅
  const logoutMutation = useLogout({
    onSuccess: () => {
      alert("👋 로그아웃 완료!");
    },
  });

  // 로그인 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  // 로그아웃 버튼 클릭
  const handleLogout = () => {
    logoutMutation.mutate(undefined);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      {/* 로그인 폼 */}
      <form
        onSubmit={handleSubmit}
        className="w-[360px] rounded-lg border border-gray-300 bg-white p-6 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">Test Login</h1>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className="w-[360px] rounded-md bg-red-500 py-2 font-semibold text-white transition-colors hover:bg-red-600"
      >
        {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
      </button>
    </main>
  );
}
