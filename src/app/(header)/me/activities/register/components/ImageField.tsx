import { Controller, FieldError, FieldValues, useFormContext } from "react-hook-form";

import { subTitleClass } from "@/app/(header)/me/activities/register/components/MyActivityForm";
import { ActivityImageUploader } from "@/components/ui/image-uploader";
import Field from "@/components/ui/input/Field";

interface ImageFieldProps {
  onMainChange: (files: (File | string)[]) => void;
  onSubChange: (files: (File | string)[]) => void;
  initialMainImages?: string[];
  initialSubImages?: string[];
}

export default function ImageField({
  onMainChange,
  onSubChange,
  initialMainImages,
  initialSubImages,
}: ImageFieldProps) {
  const {
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  const BANNER_IMAGE = "bannerImageUrl";
  const SUB_IMAGE = "subImageUrls";

  const handleChange = (type: string, images: (File | string)[], field: FieldValues) => {
    if (type === BANNER_IMAGE) onMainChange(images);
    else if (type === SUB_IMAGE) onSubChange(images);

    field.onChange(images);
  };

  const handleError = (type: string, msg: string | null) => {
    if (msg) setError(type, { message: msg });
    else clearErrors(type);
  };

  const onFieldError = (type: string) => (errors[type] as FieldError | undefined)?.message;

  return (
    <>
      <div>
        <span className={subTitleClass}>배너 이미지</span>
        <Controller
          name={BANNER_IMAGE}
          rules={{ required: "배너 이미지를 등록해주세요." }}
          render={({ field }) => (
            <Field id={BANNER_IMAGE} error={onFieldError(BANNER_IMAGE)}>
              <ActivityImageUploader
                type="banner"
                initialImages={initialMainImages}
                onChange={(images) => {
                  handleChange(BANNER_IMAGE, images, field);
                }}
                onError={(msg) => handleError(BANNER_IMAGE, msg)}
              />
            </Field>
          )}
        />
      </div>
      <div>
        <span className={subTitleClass}>소개 이미지</span>
        <Controller
          name={SUB_IMAGE}
          render={({ field }) => (
            <Field id={SUB_IMAGE} error={onFieldError(SUB_IMAGE)}>
              <ActivityImageUploader
                type="sub"
                initialImages={initialSubImages}
                onChange={(images) => handleChange(SUB_IMAGE, images, field)}
                onError={(msg) => handleError(SUB_IMAGE, msg)}
              />
            </Field>
          )}
        />

        <span className="text-2lg mt-6 block pl-2">*이미지는 최대 4개까지 등록 가능합니다.</span>
      </div>
    </>
  );
}
