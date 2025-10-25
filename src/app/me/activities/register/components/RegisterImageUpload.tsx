import { Controller, FieldError, useFormContext } from "react-hook-form";

import { ActivityImageUploader } from "@/components/ui/image-uploader";
import Field from "@/components/ui/input/Field";

interface RegisterImageUploadProps {
  onMainChange: (files: (File | string)[]) => void;
  onSubChange: (files: (File | string)[]) => void;
}

export default function RegisterImageUpload({
  onMainChange,
  onSubChange,
}: RegisterImageUploadProps) {
  const handleMainChange = (images: (File | string)[]) => {
    onMainChange(images);
  };

  const handleSubChange = (images: (File | string)[]) => {
    onSubChange(images);
  };
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="flex flex-col gap-6">
        <span className="text-2xl font-bold">배너 이미지</span>
        <Controller
          name="bannerImageUrl"
          rules={{ required: "배너 이미지를 등록해주세요." }}
          render={({ field }) => (
            <Field
              id="bannerImageUrl"
              error={(errors.bannerImageUrl as FieldError | undefined)?.message}
            >
              <ActivityImageUploader
                type="banner"
                onChange={(images) => {
                  handleMainChange(images);
                  field.onChange(images);
                }}
              />
            </Field>
          )}
        />
      </div>
      <div className="flex flex-col gap-6">
        <span className="text-2xl font-bold">소개 이미지</span>
        <ActivityImageUploader type="sub" onChange={handleSubChange} />
        <span className="text-2lg pl-2">*이미지는 최대 4개까지 등록 가능합니다.</span>
      </div>
    </>
  );
}
