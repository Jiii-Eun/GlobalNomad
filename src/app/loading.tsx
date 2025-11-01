import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="relative aspect-square w-1/4">
        <Image
          src="/images/loading.webp"
          alt="로딩중.. 글로벌로 체험을 떠나는 비행기"
          fill
          sizes="100vw"
          className="object-contain"
          priority={false}
        />
      </div>
    </div>
  );
}
