import { ActivityImageUploader } from "@/components/ui/image-uploader";

interface RegisterImageUploadProps {
  onMainChange: (files: File[]) => void;
  onSubChange: (files: File[]) => void;
}

export default function RegisterImageUpload({
  onMainChange,
  onSubChange,
}: RegisterImageUploadProps) {
  return (
    <>
      <div className="flex flex-col gap-6">
        <span className="text-2xl font-bold">배너 이미지</span>
        <ActivityImageUploader type="banner" onChange={onMainChange} />
      </div>
      <div className="flex flex-col gap-6">
        <span className="text-2xl font-bold">소개 이미지</span>
        <ActivityImageUploader type="sub" onChange={onSubChange} />
        <span className="text-2lg pl-2">*이미지는 최대 4개까지 등록 가능합니다.</span>
      </div>
    </>
  );
}
