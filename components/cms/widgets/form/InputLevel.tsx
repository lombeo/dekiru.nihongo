import { Select } from "@mantine/core";
import { LocaleKeys } from "@src/public/locales/locale";
import { useTranslation } from "next-i18next";
import { Controller } from "react-hook-form";

export const InputLevel = (props: any) => {
  const { t } = useTranslation();
  const {
    errors,
    control,
    name = "level",
    label = t(LocaleKeys.D_ENTER_SPECIFIC, {
      name: t(LocaleKeys.Level).toLowerCase(),
    }),
    disabled,
  } = props;

  const listLevelActivity = [
    {
      label: t("Easy"),
      value: "easy",
    },
    {
      label: t("Medium"),
      value: "medium",
    },
    {
      label: t("Hard"),
      value: "hard",
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
            label={label}
            data={listLevelActivity}
            value={field.value?.toString() ?? "easy"}
            size="md"
            error={errors?.level}
            disabled={disabled}
          />
        )}
      />
    </>
  );
};

export const getLevelId = (level: string) => {
  switch (level) {
    case "medium":
      return 2;
    case "hard":
      return 3;
    case "easy":
    default:
      return 1;
  }
};
