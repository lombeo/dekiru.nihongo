import { Radio } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Controller } from "react-hook-form";

export const InputVisibility = (props: any) => {
  const { control, disabled, name = "visibility" } = props;
  const { t } = useTranslation();
  return (
    <div>
      <div>{t("Type")}</div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Radio.Group {...field} size="sm" value={field.value == "1" ? "1" : "0"}>
            <Radio readOnly={disabled} value="0" label={t("Public")} className="mb-2" />
            <Radio readOnly={disabled} value="1" label={t("Private")} />
          </Radio.Group>
        )}
      />
    </div>
  );
};
