import { Status } from "@/components/icons";
import { cn } from "@/lib/cn";

interface NotificationDropDownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropDown({ isOpen, onClose }: NotificationDropDownProps) {
  const flexBetweenClass = "flex items-center justify-between";
  const borderClass = "border border-brand-gray-400";

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className={cn(
            "bg-brand-deep-green-50 absolute top-14 -right-32 z-30 h-[356px] min-w-[356px]",
            "shadow-blue rounded-[10px] px-5 py-6",
            borderClass,
            "tablet:-right-4",
            "mobile:min-w-screen mobile:min-h-screen mobile:top-0 mobile:right-0 mobile:fixed",
          )}
        >
          <div className={cn(flexBetweenClass, "mb-4 text-xl font-bold")}>
            <div>알림 개</div>
            <Status.Close className="text-brand-black svg-stroke size-6 cursor-pointer font-bold" />
          </div>
          <div className="scrollbar-hide max-h-[calc(356px-96px)] overflow-y-scroll">
            <div className={cn(borderClass, "mb-2 rounded-[5px] bg-white px-3 py-4 font-normal")}>
              <div className={cn(flexBetweenClass)}>
                <div>아이콘</div>
                <Status.Close className="size-6" />
              </div>
              <p className="text-md">
                함께하면 즐거운 스트릿 댄스(2023-01-14 15:00~18:00) 예약이{" "}
                <span className="text-brand-blue-500">승인</span>되었어요.
              </p>

              <span className="text-brand-gray-600 text-xs">분 전</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
