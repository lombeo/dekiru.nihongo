import { Select } from "@mantine/core";
import { LocaleKeys } from "@src/public/locales/locale";
import { useTranslation } from "next-i18next";
import { Controller } from "react-hook-form";

export const InputLevelId = (props: any) => {
  const { t } = useTranslation();
  const {
    errors,
    control,
    name = "levelId",
    disabled,
    label = t(LocaleKeys.D_ENTER_SPECIFIC, {
      name: t(LocaleKeys.Level).toLowerCase(),
    }),
  } = props;

  const listLevelActivity = [
    {
      label: t("Easy"),
      value: "1",
    },
    {
      label: t("Medium"),
      value: "2",
    },
    {
      label: t("Hard"),
      value: "3",
    },
  ];

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            disabled={disabled}
            label={label}
            data={listLevelActivity}
            value={field.value?.toString() ?? "1"}
            size="md"
            error={errors?.level}
          />
        )}
      />
    </>
  );
};
