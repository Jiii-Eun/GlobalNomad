import Link from "next/link";

export default function AuthNav() {
  return (
    <ul className="flex gap-6">
      <li>
        <Link href={"/login"}>로그인</Link>
      </li>
      <li>
        <Link href={"/signup"}>회원가입</Link>
      </li>
    </ul>
  );
}
