import { Status } from "@/components/icons";

import ReviewContainer from "./ReviewContainer";

export default function Review({
  averageRating,
  totalCount,
  id,
}: {
  averageRating: number;
  totalCount: number;
  id: number;
}) {
  let averageRatingText = "";
  if (averageRating) {
    if (averageRating <= 2) {
      averageRatingText = "매우 별로";
    } else if (averageRating <= 3) {
      averageRatingText = "별로";
    } else if (averageRating <= 4) {
      averageRatingText = "만족";
    } else if (averageRating <= 5) {
      averageRatingText = "매우 만족";
    }
  }

  return (
    <div className="border-brand-nomad-black/25 flex flex-col gap-6 border-t py-[40px]">
      <p className="text-brand-nomad-black text-2lg font-bold">후기</p>
      <div className="flex items-center gap-4">
        <p className="text-brand-nomad-black text-[50px] font-semibold">{averageRating}</p>
        <div className="flex flex-col gap-[8px]">
          <p className="text-2lg text-brand-nomad-black font-normal">{averageRatingText}</p>
          <div className="flex items-center gap-[6px]">
            <Status.StarFill className="svg-fill text-brand-yellow-500 size-5" />
            <p className="text-md text-brand-black font-normal">{totalCount}개 후기</p>
          </div>
        </div>
      </div>
      {totalCount === 0 ? (
        <div className="text-2lg text-brand-nomad-black items-center font-normal">
          아직 등록된 후기가 없어요.
        </div>
      ) : (
        <ReviewContainer id={id} />
      )}
    </div>
  );
}
