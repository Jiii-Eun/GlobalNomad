"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface Props {
  bannerImageUrl: string;
  /** 최대 4장만 전달 (넘어오면 자동으로 4장까지만 사용) */
  subImages?: string[];
  altPrefix?: string;
}

export default function ActivityImages({
  bannerImageUrl,
  subImages = [],
  altPrefix = "체험 이미지",
}: Props) {
  // 모바일/태블릿: 캐러셀
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    containScroll: "trimSnaps",
  });

  // ✅ 4장까지만 사용
  const subs = subImages.filter(Boolean).slice(0, 4);
  const count = subs.length;

  return (
    <>
      {/* 데스크톱(>=lg): 그리드 */}
      <div
        className="tablet:hidden mt-[42px] flex h-[540px] gap-2 overflow-hidden rounded-2xl"
        style={{ boxShadow: "0px 4px 12px rgba(17,34,17,0.05)" }}
      >
        {count === 0 && (
          <div className="relative h-full w-full">
            <Image
              src={bannerImageUrl}
              alt={`${altPrefix} 메인`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {count > 0 && (
          <>
            {/* 좌: 메인 */}
            <div className="h-full w-1/2 shrink-0">
              <Image
                src={bannerImageUrl}
                alt={`${altPrefix} 메인`}
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* 우: 서브 레이아웃 */}
            <div className="h-full w-1/2">
              {/* 1장: 우측 전부 */}
              {count === 1 && (
                <div className="relative h-full w-full">
                  <Image src={subs[0]} alt={`${altPrefix} 서브 1`} fill className="object-cover" />
                </div>
              )}

              {/* 2장: 상/하 분할 */}
              {count === 2 && (
                <div className="grid h-full grid-rows-2 gap-2">
                  {subs.map((src, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={src}
                        alt={`${altPrefix} 서브 ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3장: 상단 1장(가로 2칸), 하단 2분할 */}
              {count === 3 && (
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
                  <div className="relative col-span-2">
                    <Image
                      src={subs[0]}
                      alt={`${altPrefix} 서브 1`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {subs.slice(1).map((src, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={src}
                        alt={`${altPrefix} 서브 ${i + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 4장: 2x2 */}
              {count === 4 && (
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
                  {subs.map((src, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={src}
                        alt={`${altPrefix} 서브 ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 모바일/태블릿(<lg): Embla 캐러셀 */}
      <div className="mobile:-mx-6 tablet:block mx-0 hidden pt-[15px]">
        {/* 부모 px-6 상쇄 (24px) */}
        <div className="overflow-hidden">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {[bannerImageUrl, ...subs].map((src, i) => (
                <div key={i} className="embla__slide">
                  <div className="mobile:h-[310px] relative h-[540px] w-full">
                    <Image
                      src={src}
                      alt={`이미지 ${i}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex; /* gap 주지 마세요 (필요하면 slide 안쪽 패딩으로 처리) */
          will-change: transform;
        }
        .embla__slide {
          position: relative;
          flex: 0 0 100vw; /* ← 슬라이드는 정확히 view 폭 */
          min-width: 100%; /* 내용이 넘쳐도 폭 유지 */
        }
      `}</style>
    </>
  );
}
