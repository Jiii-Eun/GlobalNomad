"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback, useEffect } from "react";

import { Arrow } from "@/components/icons";
import { cn } from "@/lib/cn";

interface CarouselProps {
  children: React.ReactNode;
  autoplayDelay?: number;
  loop?: boolean;
}

export function EmblaCarousel({ children, autoplayDelay = 4000, loop = true }: CarouselProps) {
  const autoplay = Autoplay({ delay: autoplayDelay, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop }, [autoplay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const arrowClass = "svg-stroke size-11 text-white flex justify-center mobile:size-6";
  const arrowBackgroundClass =
    "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/60";

  return (
    <div className="group embla relative mx-auto max-w-[1920px]">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">{children}</div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="이전 체험"
        className={cn(arrowBackgroundClass, "left-6")}
      >
        <Arrow.Left className={arrowClass} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="다음 체험"
        className={cn(arrowBackgroundClass, "right-6")}
      >
        <Arrow.Right className={arrowClass} />
      </button>
    </div>
  );
}
