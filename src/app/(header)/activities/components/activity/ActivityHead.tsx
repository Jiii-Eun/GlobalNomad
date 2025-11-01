import { Status, Misc } from "@/components/icons";

export default function ActivityHead(data: {
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
}) {
  return (
    <div>
      <div className="mt-[78px] flex max-w-[1200px] items-center justify-between">
        <div className="flex flex-col">
          <div className="text-brand-nomad-black/75 text-md font-normal">{data.category}</div>
          <p className="mt-2.5 mb-4 text-3xl font-bold">{data.title}</p>
          <div className="flex gap-[12px]">
            <div className="flex items-center gap-[6px]">
              <Status.StarFill className="svg-fill text-brand-yellow-500 h-5 w-5" />
              <p className="text-md font-normal">{`${data.rating} (${data.reviewCount})`}</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <Misc.Location className="svg-fill h-5 w-5" />
              <p className="text-md text-brand-nomad-black font-normal">{data.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
