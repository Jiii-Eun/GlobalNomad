"use client";

import Image from "next/image";
import { useState } from "react";
import { Drawer } from "vaul";

import Button from "@/components/ui/button/Button";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerLayout } from "@/components/ui/modal";

import StarRating from "./StarRating";

interface ReviewProps {
  trigger: React.ReactNode;
  title: string;
  dateText: string;
  priceText: string;
  thumbnailUrl: string | null;
  closeOnSubmit?: boolean;
  onSubmit?: (payload: {
    // 추후 api 연동
    rating: number;
    content: string;
  }) => void | Promise<void>;
}

export default function ReviewModal({
  trigger,
  title,
  dateText,
  priceText,
  thumbnailUrl,
}: ReviewProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const canSubmit = rating > 0 && content.trim().length > 0;

  // 추후 api 연동
  const handleSubmit = () => {
    console.log("[ReviewModal] submit mock:", {
      rating,
      content: content.trim(),
    });
  };

  return (
    <DrawerLayout trigger={trigger} title="후기 작성" width="md" isClose>
      <DrawerHeader />
      <DrawerBody>
        <section className="flex items-center gap-6">
          {thumbnailUrl && (
            <div className="rounded-12 relative h-[126px] w-[126px] overflow-hidden">
              <Image src={thumbnailUrl} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <p className="mb-3 text-[20px] font-bold">{title}</p>
            <p className="text-2lg mb-3">{dateText}</p>
            <hr className="border-brand-nomad-black mb-3 h-[1px] opacity-10" />
            <p className="text-3xl font-bold">{priceText}</p>
          </div>
        </section>

        <div>
          <div className="mt-6">
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="후기를 작성해 주세요"
            className="border-brand-gray-800 placeholder:text-brand-gray-500/60 mt-6 h-60 w-full resize-none rounded border p-4 outline-none"
            maxLength={1000}
          />
          {!content.trim() && (
            <p className="text-brand-red-500 mt-2 text-sm">1자 이상 입력해 주세요</p>
          )}
        </div>
      </DrawerBody>

      <DrawerFooter>
        <Drawer.Close asChild>
          <Button
            type="button"
            className="h-14 w-full text-lg"
            variant="b"
            isDisabled={!canSubmit}
            onClick={handleSubmit}
          >
            작성하기
          </Button>
        </Drawer.Close>
      </DrawerFooter>
    </DrawerLayout>
  );
}
