import { NotificationLevel } from "constants/common.constant";
import { i18n, useTranslation } from "next-i18next";
import { Controller } from "react-hook-form";
import { Space, ValidationNotification } from "../../core";
import { RichEditor } from "../../core/RichText/RichEditor";

export const InputDescription = (props: any) => {
  const { control, name = "description", label, errors, required = false, disabled } = props;
  const { t } = useTranslation();

  return (
    <div>
      <div>
        {label ? label : t("Description")} {required && <span className="text-red-500">*</span>}
      </div>
      <Controller name={name} control={control} render={({ field }) => <RichEditor {...field} disabled={disabled} />} />
      <ValidationNotification message={i18n?.t(errors[name]?.message as any)} type={NotificationLevel.ERROR} />
      <Space h="sm" />
      {/* <div className="notice text-sm text-gray-primary">
        <div>
          (*) {t(LocaleKeys["For word documents"])}:{" "}
          {t(LocaleKeys["Paste single page per time"])}
        </div>
        <div>
          (*) {t(LocaleKeys["For images"])}:{" "}
          {t(LocaleKeys["Paste less than 4 images per time (maximum 2 Mb of each image)"])}
        </div>
      </div> */}
    </div>
  );
};
