import { Controller, FieldError, useFormContext } from "react-hook-form";

import { ActivityImageUploader } from "@/components/ui/image-uploader";
import Field from "@/components/ui/input/Field";

interface RegisterImageUploadProps {
  onMainChange: (files: (File | string)[]) => void;
  onSubChange: (files: (File | string)[]) => void;
  onError?: (msg: string | null) => void;
}

export default function RegisterImageUpload({
  onMainChange,
  onSubChange,
}: RegisterImageUploadProps) {
  const {
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  const BANNER_IMAGE = "bannerImageUrl";
  const SUB_IMAGE = "subImageUrls";

  const handleChange = (key: string, images: (File | string)[]) => {
    if (key === BANNER_IMAGE) onMainChange(images);
    else if (key === SUB_IMAGE) onSubChange(images);
  };

  const handleError = (key: string, msg: string | null) => {
    if (msg) setError(key, { message: msg });
    else clearErrors(key);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <span className="text-2xl font-bold">배너 이미지</span>
        <Controller
          name={BANNER_IMAGE}
          rules={{ required: "배너 이미지를 등록해주세요." }}
          render={({ field }) => (
            <Field
              id={BANNER_IMAGE}
              error={(errors.bannerImageUrl as FieldError | undefined)?.message}
            >
              <ActivityImageUploader
                type="banner"
                onChange={(images) => {
                  handleChange(BANNER_IMAGE, images);
                  field.onChange(images);
                }}
                onError={(msg) => handleError(BANNER_IMAGE, msg)}
              />
            </Field>
          )}
        />
      </div>
      <div className="flex flex-col gap-6">
        <span className="text-2xl font-bold">소개 이미지</span>
        <Field id={SUB_IMAGE} error={(errors.subImageUrls as FieldError | undefined)?.message}>
          <ActivityImageUploader
            type="sub"
            onChange={(images) => handleChange(SUB_IMAGE, images)}
            onError={(msg) => handleError(SUB_IMAGE, msg)}
          />
        </Field>

        <span className="text-2lg pl-2">*이미지는 최대 4개까지 등록 가능합니다.</span>
      </div>
    </>
  );
}
