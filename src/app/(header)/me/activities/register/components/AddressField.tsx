import {
  Controller,
  useFormContext,
  FieldError,
  Path,
  FieldValues,
  PathValue,
} from "react-hook-form";

import { subTitleClass } from "@/app/(header)/me/activities/register/components/MyActivityForm";
import Button from "@/components/ui/button/Button";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import Toast from "@/components/ui/toast";
import { cn } from "@/lib/cn";

export interface DaumAddressData {
  address: string;
  addressType?: string;
  bname?: string;
  buildingName?: string;
  roadAddress?: string;
  zonecode?: string;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: DaumAddressData) => void; theme?: object }) => {
        open: () => void;
      };
    };
  }
}

export default function AddressField<TReq extends FieldValues>() {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<TReq>();

  const fieldError = (errors.address as FieldError | undefined)?.message;
  const keyId = "address" as Path<TReq>;

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) {
      <Toast message="주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요." />;
      return;
    }

    new window.daum.Postcode({
      theme: {
        bgColor: "#112211",
        searchBgColor: "#FFFFFF",
        contentBgColor: "#FFFFFF",
        pageBgColor: "#FFFFFF",
        textColor: "#1B1B1B",
        queryTextColor: "#1B1B1B",
        postcodeTextColor: "#FF472E",
        emphTextColor: "#0085FF",
        outlineColor: "transparent",
      },
      oncomplete: (data) => {
        setValue(keyId, data.address as PathValue<TReq, typeof keyId>, {
          shouldValidate: true,
          shouldDirty: true,
        });
      },
    }).open();
  };

  return (
    <div>
      <span className={cn(subTitleClass, "mb-4")}>주소</span>
      <Field id={keyId} error={fieldError}>
        <Controller
          name={keyId}
          rules={{
            required: "주소를 입력해주세요.",
            validate: (v) => v.trim().length > 0 || "주소를 입력해주세요.",
          }}
          render={({ field }) => {
            const { value = "", onChange, onBlur, name, ref } = field;
            return (
              <div className="flex gap-2">
                <Input
                  id={keyId}
                  name={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  readOnly
                  placeholder="주소를 검색해주세요"
                  wrapperClass="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddressSearch}
                  className="rounded-lg px-4 py-2 font-semibold"
                >
                  주소 검색
                </Button>
              </div>
            );
          }}
        />
      </Field>
    </div>
  );
}
